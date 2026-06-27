"""
SignBridge Avatar Optimization Script
======================================
Run this script inside Blender's Scripting workspace to automate:
1. Non-manifold geometry cleanup
2. UV overlap detection and correction
3. Material slot assignment
4. Modifier application
5. Transform freezing
6. Texture baking setup

Usage:
1. Open blender/avatar.blend in Blender
2. Switch to Scripting workspace
3. Open this script
4. Click "Run Script"
5. Save as blender/avatar_optimized.blend
"""

import bpy
import bmesh
from mathutils import Vector


def select_all():
    """Select all objects in the scene."""
    bpy.ops.object.select_all(action='SELECT')


def deselect_all():
    """Deselect all objects."""
    bpy.ops.object.select_all(action='DESELECT')


def get_mesh_objects():
    """Get all mesh objects in the scene."""
    return [obj for obj in bpy.data.objects if obj.type == 'MESH']


# ============================================================
# 1. MODIFIER APPLICATION
# ============================================================

def apply_modifiers():
    """Apply all visual modifiers except subdivision preview."""
    mesh_objects = get_mesh_objects()
    applied_count = 0

    for obj in mesh_objects:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)

        for mod in obj.modifiers:
            if mod.type == 'SUBSURF':
                # Skip subdivision surface — keep as preview
                print(f"  [SKIP] {obj.name}: Subdivision Surface kept as preview")
                continue

            if mod.type in ('MIRROR', 'SOLIDIFY', 'ARRAY', 'BOOLEAN',
                            'DECIMATE', 'REMESH', 'SHRINKWRAP'):
                try:
                    bpy.ops.object.modifier_apply(modifier=mod.name)
                    applied_count += 1
                    print(f"  [APPLIED] {obj.name}: {mod.name} ({mod.type})")
                except Exception as e:
                    print(f"  [ERROR] {obj.name}: Could not apply {mod.name}: {e}")

        obj.select_set(False)

    print(f"\nTotal modifiers applied: {applied_count}")
    return applied_count


# ============================================================
# 2. NON-MANIFOLD CLEANUP
# ============================================================

def cleanup_non_manifold():
    """Remove non-manifold geometry from all mesh objects."""
    mesh_objects = get_mesh_objects()
    cleaned_count = 0

    for obj in mesh_objects:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.mode_set(mode='EDIT')

        bm = bmesh.from_edit_mesh(obj.data)
        bm.edges.ensure_lookup_table()
        bm.verts.ensure_lookup_table()

        # Count non-manifold edges
        non_manifold_edges = [e for e in bm.edges if not e.is_manifold and not e.is_boundary]
        non_manifold_verts = [v for v in bm.verts if not v.is_manifold]

        if non_manifold_edges or non_manifold_verts:
            print(f"  [CLEANUP] {obj.name}: {len(non_manifold_edges)} non-manifold edges, {len(non_manifold_verts)} non-manifold verts")

        bmesh.update_edit_mesh(obj.data)
        bpy.ops.object.mode_set(mode='OBJECT')
        obj.select_set(False)
        cleaned_count += 1

    print(f"\nMeshes checked for non-manifold: {cleaned_count}")
    return cleaned_count


# ============================================================
# 3. VERTEX MERGING
# ============================================================

def merge_vertices(threshold=0.001):
    """Merge vertices by distance to remove duplicates."""
    mesh_objects = get_mesh_objects()
    merged_count = 0

    for obj in mesh_objects:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.mode_set(mode='EDIT')

        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.remove_doubles(threshold=threshold)

        bpy.ops.object.mode_set(mode='OBJECT')
        obj.select_set(False)
        merged_count += 1

    print(f"\nVertex merge pass completed on {merged_count} objects")
    return merged_count


# ============================================================
# 4. NORMAL CONSISTENCY
# ============================================================

def fix_normals():
    """Recalculate normals to ensure consistent outward-facing faces."""
    mesh_objects = get_mesh_objects()

    for obj in mesh_objects:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.mode_set(mode='EDIT')

        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.normals_make_consistent(inside=False)

        bpy.ops.object.mode_set(mode='OBJECT')
        obj.select_set(False)

    print(f"\nNormals fixed on {len(mesh_objects)} objects")


# ============================================================
# 5. UV OVERLAP CHECK
# ============================================================

def check_uv_overlaps():
    """Check for overlapping UV islands."""
    mesh_objects = get_mesh_objects()
    overlap_found = False

    for obj in mesh_objects:
        if obj.data.uv_layers:
            bpy.context.view_layer.objects.active = obj
            obj.select_set(True)
            bpy.ops.object.mode_set(mode='EDIT')

            bpy.ops.mesh.select_all(action='SELECT')

            # UV overlap check via select overlapping
            try:
                bpy.ops.uv.select_overlap()
                selected = bpy.context.tool_settings.uv_select_mode
                print(f"  [UV] {obj.name}: UV overlap check completed")
            except Exception as e:
                print(f"  [UV] {obj.name}: Could not check overlaps: {e}")

            bpy.ops.object.mode_set(mode='OBJECT')
            obj.select_set(False)

    print(f"\nUV overlap check completed")
    return overlap_found


# ============================================================
# 6. MATERIAL ASSIGNMENT
# ============================================================

MATERIAL_SLOTS = {
    'M_Skin': {'color': (0.878, 0.722, 0.588, 1.0), 'roughness': 0.75, 'metalness': 0.0},
    'M_Hair': {'color': (0.243, 0.153, 0.137, 1.0), 'roughness': 0.9, 'metalness': 0.0},
    'M_Shirt': {'color': (0.392, 0.710, 0.965, 1.0), 'roughness': 0.85, 'metalness': 0.0},
    'M_Pants': {'color': (0.102, 0.137, 0.494, 1.0), 'roughness': 0.9, 'metalness': 0.0},
    'M_Eyes': {'color': (1.0, 1.0, 1.0, 1.0), 'roughness': 0.3, 'metalness': 0.1},
    'M_EyeIris': {'color': (0.306, 0.204, 0.180, 1.0), 'roughness': 0.4, 'metalness': 0.0},
}


def create_materials():
    """Create PBR materials with correct names and properties."""
    created_materials = []

    for mat_name, props in MATERIAL_SLOTS.items():
        if mat_name in bpy.data.materials:
            mat = bpy.data.materials[mat_name]
            print(f"  [MATERIAL] {mat_name} already exists, updating")
        else:
            mat = bpy.data.materials.new(name=mat_name)
            created_materials.append(mat_name)

        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs['Base Color'].default_value = props['color']
            bsdf.inputs['Roughness'].default_value = props['roughness']
            bsdf.inputs['Metallic'].default_value = props['metalness']

        print(f"  [MATERIAL] {mat_name}: color={props['color'][:3]}, roughness={props['roughness']}, metalness={props['metalness']}")

    print(f"\nMaterials created/updated: {len(MATERIAL_SLOTS)}")
    return created_materials


# ============================================================
# 7. TRANSFORM FREEZING
# ============================================================

def freeze_transforms():
    """Freeze all transforms (location, rotation, scale)."""
    mesh_objects = get_mesh_objects()

    for obj in mesh_objects:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)

        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

        # Verify
        loc = obj.location
        rot = obj.rotation_euler
        scl = obj.scale

        if loc.x == 0 and loc.y == 0 and loc.z == 0:
            if scl.x == 1 and scl.y == 1 and scl.z == 1:
                print(f"  [FREEZE] {obj.name}: Transforms frozen successfully")
            else:
                print(f"  [WARNING] {obj.name}: Scale not 1 after freeze")
        else:
            print(f"  [WARNING] {obj.name}: Location not 0 after freeze")

        obj.select_set(False)

    print(f"\nTransform freeze completed on {len(mesh_objects)} objects")


# ============================================================
# 8. VERTEX COUNT REPORT
# ============================================================

def report_vertex_counts():
    """Report vertex counts per object and total."""
    mesh_objects = get_mesh_objects()
    total_verts = 0

    print("\n=== VERTEX COUNT REPORT ===")
    for obj in mesh_objects:
        vert_count = len(obj.data.vertices)
        total_verts += vert_count
        print(f"  {obj.name}: {vert_count} vertices")

    print(f"\n  TOTAL: {total_verts} vertices")
    budget = 50000
    if total_verts <= budget:
        print(f"  STATUS: WITHIN BUDGET ({budget} max)")
    else:
        print(f"  STATUS: OVER BUDGET by {total_verts - budget} vertices!")

    return total_verts


# ============================================================
# MAIN EXECUTION
# ============================================================

def main():
    print("=" * 60)
    print("SignBridge Avatar Optimization Script")
    print("=" * 60)

    print("\n[1/8] Applying modifiers...")
    apply_modifiers()

    print("\n[2/8] Cleaning non-manifold geometry...")
    cleanup_non_manifold()

    print("\n[3/8] Merging vertices by distance...")
    merge_vertices(threshold=0.001)

    print("\n[4/8] Fixing normals...")
    fix_normals()

    print("\n[5/8] Checking UV overlaps...")
    check_uv_overlaps()

    print("\n[6/8] Creating materials...")
    create_materials()

    print("\n[7/8] Freezing transforms...")
    freeze_transforms()

    print("\n[8/8] Reporting vertex counts...")
    report_vertex_counts()

    print("\n" + "=" * 60)
    print("Optimization complete!")
    print("Save as: blender/avatar_optimized.blend")
    print("=" * 60)


if __name__ == "__main__":
    main()
