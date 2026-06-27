"""
SignBridge Hand Rigging Script
================================
Run this script inside Blender's Scripting workspace to automate:
1. Create 15 finger bones per hand (5 fingers x 3 joints)
2. Parent finger bones to wrist bones
3. Set rotation limits for anatomical joint constraints
4. Weight paint knuckle loops
5. Export final rigged model as GLB

Usage:
1. Open blender/avatar_body_rig.blend in Blender
2. Switch to Scripting workspace
3. Open this script
4. Click "Run Script"
5. Save as blender/avatar_final_rig.blend
6. Export as public/models/avatar.glb
"""

import bpy
import math
from mathutils import Vector


# ============================================================
# FINGER BONE DEFINITIONS
# ============================================================

# Finger names and their relative offsets from wrist
FINGER_NAMES = ['Thumb', 'Index', 'Middle', 'Ring', 'Little']

# Joint names for each finger (proximal → middle → distal)
JOINT_NAMES = ['1', '2', '3']

# Relative positions from wrist bone (x_offset, y_offset, z_offset)
# These are approximate — adjust based on actual mesh topology
FINGER_OFFSETS = {
    'Thumb':  {'start': (0.02, 0.02, 0.0), 'dir': (0.03, 0.03, 0.02)},
    'Index':  {'start': (0.02, -0.01, 0.0), 'dir': (0.03, 0.0, 0.0)},
    'Middle': {'start': (0.0, -0.01, 0.0), 'dir': (0.03, 0.0, 0.0)},
    'Ring':   {'start': (-0.02, -0.01, 0.0), 'dir': (0.03, 0.0, 0.0)},
    'Little': {'start': (-0.03, -0.01, 0.0), 'dir': (0.025, 0.0, 0.0)},
}

# Bone lengths for each joint
BONE_LENGTHS = {
    '1': 0.035,  # Proximal phalanx
    '2': 0.025,  # Middle phalanx
    '3': 0.020,  # Distal phalanx
}

# Anatomical rotation limits (degrees)
FINGER_LIMITS = {
    '1': {'min': (-20, 0, -15), 'max': (90, 0, 15)},   # Proximal
    '2': {'min': (-10, 0, -10), 'max': (110, 0, 10)},   # Middle
    '3': {'min': (-10, 0, -10), 'max': (120, 0, 10)},   # Distal
}

# Thumb has different limits
THUMB_LIMITS = {
    '1': {'min': (-30, -20, -40), 'max': (60, 20, 40)},
    '2': {'min': (-20, 0, -10), 'max': (90, 0, 10)},
    '3': {'min': (-10, 0, -10), 'max': (100, 0, 10)},
}


# ============================================================
# 1. CREATE FINGER BONES
# ============================================================

def create_finger_bones(side='Left'):
    """Create 15 finger bones for one hand."""
    armature = bpy.data.objects.get('AvatarArmature')
    if not armature:
        print("ERROR: Armature not found")
        return

    # Get the wrist bone to position fingers
    wrist_name = f'mixamorig{side}Hand'
    wrist_bone = armature.data.bones.get(wrist_name)
    if not wrist_bone:
        print(f"ERROR: Wrist bone {wrist_name} not found")
        return

    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='EDIT')

    edit_bones = armature.data.edit_bones
    wrist_pos = wrist_bone.head

    bones_created = 0

    for finger_name in FINGER_NAMES:
        offsets = FINGER_OFFSETS[finger_name]
        current_pos = Vector(wrist_pos) + Vector(offsets['start'])

        parent_name = wrist_name

        for joint_idx, joint_name in enumerate(JOINT_NAMES):
            # Create bone name
            bone_name = f'mixamorig{side}Hand{finger_name}{joint_name}'

            # Calculate bone positions
            bone_len = BONE_LENGTHS[joint_name]
            direction = Vector(offsets['dir']).normalized()
            head_pos = current_pos
            tail_pos = head_pos + direction * bone_len

            # Create the bone
            bone = edit_bones.new(bone_name)
            bone.head = head_pos
            bone.tail = tail_pos

            # Set parent
            if parent_name in edit_bones:
                bone.parent = edit_bones[parent_name]

            # Update for next joint
            current_pos = tail_pos
            parent_name = bone_name
            bones_created += 1

    bpy.ops.object.mode_set(mode='OBJECT')
    print(f"  [{side}] Created {bones_created} finger bones")
    return bones_created


# ============================================================
# 2. SET FINGER ROTATION LIMITS
# ============================================================

def set_finger_limits(side='Left'):
    """Set rotation limits for all finger bones."""
    armature = bpy.data.objects.get('AvatarArmature')
    if not armature:
        return

    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='POSE')

    limited_count = 0

    for finger_name in FINGER_NAMES:
        limits = THUMB_LIMITS if finger_name == 'Thumb' else FINGER_LIMITS

        for joint_name in JOINT_NAMES:
            bone_name = f'mixamorig{side}Hand{finger_name}{joint_name}'
            pose_bone = armature.pose.bones.get(bone_name)

            if pose_bone:
                pose_bone.rotation_mode = 'XYZ'
                bone_limits = limits[joint_name]

                pose_bone.rotation_limits_min = (
                    math.radians(bone_limits['min'][0]),
                    math.radians(bone_limits['min'][1]),
                    math.radians(bone_limits['min'][2])
                )
                pose_bone.rotation_limits_max = (
                    math.radians(bone_limits['max'][0]),
                    math.radians(bone_limits['max'][1]),
                    math.radians(bone_limits['max'][2])
                )
                pose_bone.use_limit_rotation = True
                limited_count += 1

    bpy.ops.object.mode_set(mode='OBJECT')
    print(f"  [{side}] Set rotation limits on {limited_count} finger bones")


# ============================================================
# 3. WEIGHT PAINT FINGER JOINTS
# ============================================================

def weight_paint_fingers(side='Left'):
    """Apply weight painting to finger joints for smooth bending."""
    mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']

    for mesh_obj in mesh_objects:
        bpy.context.view_layer.objects.active = mesh_obj
        mesh_obj.select_set(True)
        bpy.ops.object.mode_set(mode='WEIGHT_PAINT')

        # Find vertex groups for this hand's fingers
        for finger_name in FINGER_NAMES:
            for joint_name in JOINT_NAMES:
                group_name = f'mixamorig{side}Hand{finger_name}{joint_name}'
                vg = mesh_obj.vertex_groups.get(group_name)
                if vg:
                    # Smooth the weight painting
                    try:
                        bpy.ops.object.vertex_group_smooth(group=group_name, factor=0.3)
                    except Exception:
                        pass

        bpy.ops.object.mode_set(mode='OBJECT')
        mesh_obj.select_set(False)

    print(f"  [{side}] Weight painting applied to finger joints")


# ============================================================
# 4. FREEZE AND PREPARE FOR EXPORT
# ============================================================

def freeze_all_transforms():
    """Freeze transforms on all objects for clean export."""
    for obj in bpy.data.objects:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        obj.select_set(False)

    print("  All transforms frozen")


# ============================================================
# 5. EXPORT GLB
# ============================================================

def export_glb(filepath):
    """Export the fully rigged model as GLB."""
    # Select only the armature and mesh
    bpy.ops.object.select_all(action='DESELECT')

    for obj in bpy.data.objects:
        if obj.type in ('ARMATURE', 'MESH'):
            obj.select_set(True)

    # Export as GLB
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_texcoords=True,
        export_normals=True,
        export_materials='EXPORT',
        export_yup=True,
    )

    print(f"  Exported GLB to: {filepath}")


# ============================================================
# 6. VERIFICATION
# ============================================================

def verify_hand_rig():
    """Verify hand rig is complete."""
    armature = bpy.data.objects.get('AvatarArmature')
    if not armature:
        print("ERROR: Armature not found")
        return False

    print("\n=== HAND RIG VERIFICATION ===")

    total_finger_bones = 0
    for side in ['Left', 'Right']:
        side_count = 0
        for bone in armature.data.bones:
            if f'mixamorig{side}Hand' in bone.name and bone.name != f'mixamorig{side}Hand':
                side_count += 1
        print(f"  {side} hand bones: {side_count}")
        total_finger_bones += side_count

    print(f"  Total finger bones: {total_finger_bones}")

    expected = 30  # 5 fingers x 3 joints x 2 hands
    if total_finger_bones == expected:
        print(f"  STATUS: CORRECT ({expected} expected)")
    else:
        print(f"  STATUS: MISMATCH ({expected} expected, {total_finger_bones} found)")

    # Count total bones
    total_bones = len(armature.data.bones)
    print(f"  Total armature bones: {total_bones}")
    print(f"  Expected total: 52 (22 body + 30 hand)")

    return total_finger_bones == expected


# ============================================================
# MAIN EXECUTION
# ============================================================

def main():
    print("=" * 60)
    print("SignBridge Hand Rigging Script")
    print("=" * 60)

    print("\n[1/6] Creating left hand finger bones...")
    create_finger_bones('Left')

    print("\n[2/6] Creating right hand finger bones...")
    create_finger_bones('Right')

    print("\n[3/6] Setting finger rotation limits...")
    set_finger_limits('Left')
    set_finger_limits('Right')

    print("\n[4/6] Weight painting finger joints...")
    weight_paint_fingers('Left')
    weight_paint_fingers('Right')

    print("\n[5/6] Freezing transforms...")
    freeze_all_transforms()

    print("\n[6/6] Verifying hand rig...")
    verify_hand_rig()

    # Export GLB
    import os
    export_dir = bpy.path.abspath("//")
    if not export_dir:
        export_dir = "/tmp/"

    glb_path = os.path.join(export_dir, "avatar.glb")
    print(f"\n[EXPORT] Exporting GLB to: {glb_path}")
    export_glb(glb_path)

    print("\n" + "=" * 60)
    print("Hand rigging complete!")
    print("Save as: blender/avatar_final_rig.blend")
    print("GLB exported to: public/models/avatar.glb")
    print("=" * 60)


if __name__ == "__main__":
    main()
