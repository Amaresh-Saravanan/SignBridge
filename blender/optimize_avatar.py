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


def select_all():
    """Select all objects in the scene."""
    bpy.ops.object.select_all(action='SELECT')


def deselect_all():
    """Deselect all objects."""
    bpy.ops.object.select_all(action='DESELECT')


def get_mesh_objects():
    """Get all mesh objects in the scene."""
    return [obj for obj in bpy.data.objects if obj.type == 'MESH']


def set_active_object(obj):
    """Make an object active and selected for Blender operators."""
    deselect_all()
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)


def set_object_mode(mode='OBJECT'):
    """Safely switch object mode when Blender allows it."""
    if bpy.context.object and bpy.context.object.mode != mode:
        bpy.ops.object.mode_set(mode=mode)


# ============================================================
# 1. MODIFIER APPLICATION
# ============================================================

def apply_modifiers():
    """Apply all visual modifiers except subdivision preview."""
    mesh_objects = get_mesh_objects()
    applied_count = 0

    for obj in mesh_objects:
        set_active_object(obj)

        for mod in list(obj.modifiers):
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

        deselect_all()

    print(f"\nTotal modifiers applied: {applied_count}")
    return applied_count


# ============================================================
# 2. NON-MANIFOLD CLEANUP
# ============================================================

def cleanup_non_manifold():
    """Remove loose geometry and report any remaining non-manifold elements."""
    mesh_objects = get_mesh_objects()
    checked_count = 0
    remaining_issues = 0

    for obj in mesh_objects:
        set_active_object(obj)
        set_object_mode('EDIT')

        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.delete_loose()

        bm = bmesh.from_edit_mesh(obj.data)
        bm.edges.ensure_lookup_table()
        bm.verts.ensure_lookup_table()

        # Count non-manifold edges
        non_manifold_edges = [e for e in bm.edges if not e.is_manifold and not e.is_boundary]
        non_manifold_verts = [v for v in bm.verts if not v.is_manifold]

        if non_manifold_edges or non_manifold_verts:
            print(f"  [CLEANUP] {obj.name}: {len(non_manifold_edges)} non-manifold edges, {len(non_manifold_verts)} non-manifold verts")
            remaining_issues += len(non_manifold_edges) + len(non_manifold_verts)
        else:
            print(f"  [CLEANUP] {obj.name}: no remaining non-manifold geometry")

        bmesh.update_edit_mesh(obj.data)
        set_object_mode('OBJECT')
        deselect_all()
        checked_count += 1

    print(f"\nMeshes checked for non-manifold: {checked_count}")
    if remaining_issues:
        print(f"Remaining non-manifold elements requiring manual review: {remaining_issues}")
    return checked_count


# ============================================================
# 3. VERTEX MERGING
# ============================================================

def merge_vertices(threshold=0.001):
    """Merge vertices by distance to remove duplicates."""
    mesh_objects = get_mesh_objects()
    merged_count = 0

    for obj in mesh_objects:
        set_active_object(obj)
        set_object_mode('EDIT')

        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.merge_by_distance(distance=threshold)

        set_object_mode('OBJECT')
        deselect_all()
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
        set_active_object(obj)
        set_object_mode('EDIT')

        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.normals_make_consistent(inside=False)

        set_object_mode('OBJECT')
        deselect_all()

    print(f"\nNormals fixed on {len(mesh_objects)} objects")


# ============================================================
# 5. UV OVERLAP CHECK
# ============================================================

def check_uv_overlaps():
    """Check for overlapping UV islands."""
    mesh_objects = get_mesh_objects()
    overlap_objects = []

    for obj in mesh_objects:
        if not obj.data.uv_layers:
            print(f"  [UV] {obj.name}: skipped (no UV layers)")
            continue

        set_active_object(obj)
        set_object_mode('EDIT')

        bpy.ops.mesh.select_all(action='SELECT')

        try:
            bpy.ops.uv.select_all(action='SELECT')
            bpy.ops.uv.select_overlap()
            bmesh.update_edit_mesh(obj.data)
            bm = bmesh.from_edit_mesh(obj.data)
            uv_layer = bm.loops.layers.uv.active
            has_overlap = any(loop[uv_layer].select for face in bm.faces for loop in face.loops)

            if has_overlap:
                overlap_objects.append(obj.name)
                print(f"  [UV] {obj.name}: overlapping UVs detected")
            else:
                print(f"  [UV] {obj.name}: no overlapping UVs detected")
        except Exception as e:
            print(f"  [UV] {obj.name}: Could not check overlaps: {e}")

        set_object_mode('OBJECT')
        deselect_all()

    print(f"\nUV overlap check completed")
    if overlap_objects:
        print(f"Objects needing UV review: {', '.join(overlap_objects)}")
    return overlap_objects


# ============================================================
# 6. MATERIAL ASSIGNMENT
# ============================================================

MATERIAL_SLOTS = {
    'M_Skin': {'color': (0.878, 0.722, 0.588, 1.0), 'roughness': 0.75, 'metalness': 0.0},
    'M_Hair': {'color': (0.243, 0.153, 0.137, 1.0), 'roughness': 0.9, 'metalness': 0.0},
    'M_Shirt': {'color': (0.392, 0.710, 0.965, 1.0), 'roughness': 0.85, 'metalness': 0.0},
    'M_Pants': {'color': (0.102, 0.137, 0.494, 1.0), 'roughness': 0.9, 'metalness': 0.0},
    'M_Shoes': {'color': (0.215, 0.215, 0.215, 1.0), 'roughness': 0.6, 'metalness': 0.0},
    'M_Eyes': {'color': (1.0, 1.0, 1.0, 1.0), 'roughness': 0.3, 'metalness': 0.1},
    'M_EyeIris': {'color': (0.306, 0.204, 0.180, 1.0), 'roughness': 0.4, 'metalness': 0.0},
}


OBJECT_MATERIAL_HINTS = {
    'skin': 'M_Skin',
    'body': 'M_Skin',
    'face': 'M_Skin',
    'hair': 'M_Hair',
    'shirt': 'M_Shirt',
    'top': 'M_Shirt',
    'pant': 'M_Pants',
    'leg': 'M_Pants',
    'shoe': 'M_Shoes',
    'eyeiris': 'M_EyeIris',
    'iris': 'M_EyeIris',
    'eye': 'M_Eyes',
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


def guess_material_name(object_name):
    """Guess the correct material from the object name using simple naming hints."""
    name = object_name.lower()
    for hint, material_name in OBJECT_MATERIAL_HINTS.items():
        if hint in name:
            return material_name
    return None


def assign_material_slots():
    """Assign a standard material slot to meshes based on object names."""
    mesh_objects = get_mesh_objects()
    assigned_count = 0

    for obj in mesh_objects:
        material_name = guess_material_name(obj.name)
        if not material_name:
            print(f"  [ASSIGN] {obj.name}: no material hint found, skipped")
            continue

        material = bpy.data.materials.get(material_name)
        if material is None:
            print(f"  [ASSIGN] {obj.name}: material {material_name} missing, skipped")
            continue

        if obj.data.materials:
            obj.data.materials[0] = material
        else:
            obj.data.materials.append(material)

        assigned_count += 1
        print(f"  [ASSIGN] {obj.name}: assigned {material_name}")

    print(f"\nMaterial slot assignment completed on {assigned_count} objects")
    return assigned_count


# ============================================================
# 7. TRANSFORM FREEZING
# ============================================================

def freeze_transforms():
    """Freeze all transforms (location, rotation, scale)."""
    mesh_objects = get_mesh_objects()

    for obj in mesh_objects:
        set_active_object(obj)

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

        deselect_all()

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

    print("\n[6/8] Creating and assigning materials...")
    create_materials()
    assign_material_slots()

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
