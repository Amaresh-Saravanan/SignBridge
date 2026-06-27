"""
SignBridge Body Rigging Script
================================
Run this script inside Blender's Scripting workspace to automate:
1. Create bipedal armature (Spine, Neck, Head, Shoulders, Arms, Wrists)
2. Configure IK constraints for elbows and wrists
3. Parent mesh to armature with automatic weights
4. Export armature specification

Usage:
1. Open blender/avatar_optimized.blend in Blender
2. Switch to Scripting workspace
3. Open this script
4. Click "Run Script"
5. Save as blender/avatar_body_rig.blend
"""

import bpy
import math
from mathutils import Vector, Euler


# ============================================================
# BONE DEFINITIONS — Three.js Compatible Nomenclature
# ============================================================

# Standard Three.js bone names (mixamorig convention)
BONE_DEFS = {
    # Spine chain
    'mixamorigHips':           {'head': (0, 0, 1.0),   'tail': (0, 0, 1.15),  'parent': None},
    'mixamorigSpine':          {'head': (0, 0, 1.15),  'tail': (0, 0, 1.35),  'parent': 'mixamorigHips'},
    'mixamorigSpine1':         {'head': (0, 0, 1.35),  'tail': (0, 0, 1.50),  'parent': 'mixamorigSpine'},
    'mixamorigSpine2':         {'head': (0, 0, 1.50),  'tail': (0, 0, 1.60),  'parent': 'mixamorigSpine1'},

    # Neck and Head
    'mixamorigNeck':           {'head': (0, 0, 1.60),  'tail': (0, 0, 1.72),  'parent': 'mixamorigSpine2'},
    'mixamorigHead':           {'head': (0, 0, 1.72),  'tail': (0, 0, 1.90),  'parent': 'mixamorigNeck'},

    # Left Arm
    'mixamorigLeftShoulder':   {'head': (0.08, 0, 1.58),'tail': (0.18, 0, 1.58),'parent': 'mixamorigSpine2'},
    'mixamorigLeftArm':        {'head': (0.18, 0, 1.58),'tail': (0.40, 0, 1.58),'parent': 'mixamorigLeftShoulder'},
    'mixamorigLeftForeArm':    {'head': (0.40, 0, 1.58),'tail': (0.60, 0, 1.58),'parent': 'mixamorigLeftArm'},
    'mixamorigLeftHand':       {'head': (0.60, 0, 1.58),'tail': (0.68, 0, 1.58),'parent': 'mixamorigLeftForeArm'},

    # Right Arm
    'mixamorigRightShoulder':  {'head': (-0.08, 0, 1.58),'tail': (-0.18, 0, 1.58),'parent': 'mixamorigSpine2'},
    'mixamorigRightArm':       {'head': (-0.18, 0, 1.58),'tail': (-0.40, 0, 1.58),'parent': 'mixamorigRightShoulder'},
    'mixamorigRightForeArm':   {'head': (-0.40, 0, 1.58),'tail': (-0.60, 0, 1.58),'parent': 'mixamorigRightArm'},
    'mixamorigRightHand':      {'head': (-0.60, 0, 1.58),'tail': (-0.68, 0, 1.58),'parent': 'mixamorigRightForeArm'},

    # Left Leg
    'mixamorigLeftUpLeg':      {'head': (0.10, 0, 1.0), 'tail': (0.10, 0, 0.55),'parent': 'mixamorigHips'},
    'mixamorigLeftLeg':        {'head': (0.10, 0, 0.55),'tail': (0.10, 0, 0.10),'parent': 'mixamorigLeftUpLeg'},
    'mixamorigLeftFoot':       {'head': (0.10, 0, 0.10),'tail': (0.10, -0.12, 0),'parent': 'mixamorigLeftLeg'},
    'mixamorigLeftToeBase':    {'head': (0.10, -0.12, 0),'tail': (0.10, -0.20, 0),'parent': 'mixamorigLeftFoot'},

    # Right Leg
    'mixamorigRightUpLeg':     {'head': (-0.10, 0, 1.0),'tail': (-0.10, 0, 0.55),'parent': 'mixamorigHips'},
    'mixamorigRightLeg':       {'head': (-0.10, 0, 0.55),'tail': (-0.10, 0, 0.10),'parent': 'mixamorigRightUpLeg'},
    'mixamorigRightFoot':      {'head': (-0.10, 0, 0.10),'tail': (-0.10, -0.12, 0),'parent': 'mixamorigRightLeg'},
    'mixamorigRightToeBase':   {'head': (-0.10, -0.12, 0),'tail': (-0.10, -0.20, 0),'parent': 'mixamorigRightFoot'},
}


# ============================================================
# ROTATION LIMITS (in degrees)
# ============================================================

ROTATION_LIMITS = {
    'mixamorigSpine':           {'min': (-10, 0, -5),   'max': (30, 0, 5)},
    'mixamorigSpine1':          {'min': (-10, 0, -5),   'max': (25, 0, 5)},
    'mixamorigSpine2':          {'min': (-10, 0, -5),   'max': (20, 0, 5)},
    'mixamorigNeck':            {'min': (-30, -40, -10),'max': (30, 40, 10)},
    'mixamorigHead':            {'min': (-30, -40, -15),'max': (30, 40, 15)},
    'mixamorigLeftShoulder':    {'min': (-90, -40, -90),'max': (90, 40, 90)},
    'mixamorigLeftArm':         {'min': (-180, 0, -90), 'max': (180, 0, 90)},
    'mixamorigLeftForeArm':     {'min': (-150, 0, 0),   'max': (0, 0, 0)},
    'mixamorigLeftHand':        {'min': (-80, -20, -30), 'max': (80, 20, 30)},
    'mixamorigRightShoulder':   {'min': (-90, -40, -90),'max': (90, 40, 90)},
    'mixamorigRightArm':        {'min': (-180, 0, -90), 'max': (180, 0, 90)},
    'mixamorigRightForeArm':    {'min': (-150, 0, 0),   'max': (0, 0, 0)},
    'mixamorigRightHand':       {'min': (-80, -20, -30), 'max': (80, 20, 30)},
    'mixamorigLeftUpLeg':       {'min': (-120, 0, -30), 'max': (40, 0, 30)},
    'mixamorigLeftLeg':         {'min': (-150, 0, 0),   'max': (0, 0, 0)},
    'mixamorigLeftFoot':        {'min': (-50, -20, -10),'max': (80, 20, 10)},
    'mixamorigRightUpLeg':      {'min': (-120, 0, -30), 'max': (40, 0, 30)},
    'mixamorigRightLeg':        {'min': (-150, 0, 0),   'max': (0, 0, 0)},
    'mixamorigRightFoot':       {'min': (-50, -20, -10),'max': (80, 20, 10)},
}


# ============================================================
# 1. CREATE ARMATURE
# ============================================================

def create_armature():
    """Create the bipedal armature with all body bones."""
    # Create armature data
    armature_data = bpy.data.armatures.new('AvatarArmature')
    armature_data.display_type = 'OCTAHEDRAL'

    # Create armature object
    armature_obj = bpy.data.objects.new('AvatarArmature', armature_data)
    bpy.context.collection.objects.link(armature_obj)

    # Set as active
    bpy.context.view_layer.objects.active = armature_obj
    armature_obj.select_set(True)

    # Enter edit mode
    bpy.ops.object.mode_set(mode='EDIT')

    # Create all bones
    edit_bones = armature_data.edit_bones

    for bone_name, bone_def in BONE_DEFS.items():
        bone = edit_bones.new(bone_name)
        bone.head = Vector(bone_def['head'])
        bone.tail = Vector(bone_def['tail'])

        # Set parent
        if bone_def['parent'] and bone_def['parent'] in edit_bones:
            bone.parent = edit_bones[bone_def['parent']]

    # Set Hips as root
    if 'mixamorigHips' in edit_bones:
        edit_bones['mixamorigHips'].parent = None

    # Exit edit mode
    bpy.ops.object.mode_set(mode='OBJECT')

    print(f"Armature created with {len(BONE_DEFS)} bones")
    return armature_obj


# ============================================================
# 2. SETUP IK CONSTRAINTS
# ============================================================

def setup_ik_constraints():
    """Add IK constraints to forearms for elbow targeting."""
    armature = bpy.data.objects.get('AvatarArmature')
    if not armature:
        print("ERROR: Armature not found")
        return

    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='POSE')

    # Left Arm IK
    left_forearm = armature.pose.bones.get('mixamorigLeftForeArm')
    if left_forearm:
        ik = left_forearm.constraints.new('IK')
        ik.name = 'IK_LeftArm'
        ik.target = armature
        ik.subtarget = 'mixamorigLeftHand'
        ik.chain_count = 2
        print("  [IK] Left forearm IK constraint added")

    # Right Arm IK
    right_forearm = armature.pose.bones.get('mixamorigRightForeArm')
    if right_forearm:
        ik = right_forearm.constraints.new('IK')
        ik.name = 'IK_RightArm'
        ik.target = armature
        ik.subtarget = 'mixamorigRightHand'
        ik.chain_count = 2
        print("  [IK] Right forearm IK constraint added")

    bpy.ops.object.mode_set(mode='OBJECT')
    print("IK constraints configured")


# ============================================================
# 3. SET ROTATION LIMITS
# ============================================================

def set_rotation_limits():
    """Set bone rotation limits using locked tracks."""
    armature = bpy.data.objects.get('AvatarArmature')
    if not armature:
        return

    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='POSE')

    for bone_name, limits in ROTATION_LIMITS.items():
        pose_bone = armature.pose.bones.get(bone_name)
        if pose_bone:
            pose_bone.rotation_mode = 'XYZ'

            # Set rotation limits
            pose_bone.rotation_limits_min = (
                math.radians(limits['min'][0]),
                math.radians(limits['min'][1]),
                math.radians(limits['min'][2])
            )
            pose_bone.rotation_limits_max = (
                math.radians(limits['max'][0]),
                math.radians(limits['max'][1]),
                math.radians(limits['max'][2])
            )

            # Enable rotation limits
            pose_bone.use_limit_rotation = True

            print(f"  [LIMIT] {bone_name}: min={limits['min']}, max={limits['max']}")

    bpy.ops.object.mode_set(mode='OBJECT')
    print("Rotation limits configured")


# ============================================================
# 4. PARENT MESH TO ARMATURE
# ============================================================

def parent_mesh_to_armature():
    """Parent the character mesh to the armature with automatic weights."""
    armature = bpy.data.objects.get('AvatarArmature')
    if not armature:
        print("ERROR: Armature not found")
        return

    # Find mesh objects
    mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']

    if not mesh_objects:
        print("WARNING: No mesh objects found")
        return

    # Select armature first
    bpy.ops.object.select_all(action='DESELECT')
    armature.select_set(True)
    bpy.context.view_layer.objects.active = armature

    # Select mesh objects
    for mesh_obj in mesh_objects:
        mesh_obj.select_set(True)

    # Parent with automatic weights
    try:
        bpy.ops.object.parent_set(type='ARMATURE_AUTO')
        print(f"  [PARENT] {len(mesh_objects)} mesh objects parented with automatic weights")
    except Exception as e:
        print(f"  [ERROR] Auto-weight failed: {e}")
        try:
            bpy.ops.object.parent_set(type='ARMATURE_ENVELOPE')
            print(f"  [PARENT] Fallback: parented with envelope weights")
        except Exception as e2:
            print(f"  [ERROR] Envelope weight also failed: {e2}")

    bpy.ops.object.select_all(action='DESELECT')


# ============================================================
# 5. WEIGHT PAINT SMOOTHING
# ============================================================

def smooth_weights():
    """Apply weight smoothing to prevent sharp deformations."""
    mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']

    for mesh_obj in mesh_objects:
        bpy.context.view_layer.objects.active = mesh_obj
        mesh_obj.select_set(True)
        bpy.ops.object.mode_set(mode='WEIGHT_PAINT')

        try:
            bpy.ops.object.vertex_group_smooth_all(factor=0.5)
            print(f"  [WEIGHT] {mesh_obj.name}: Weights smoothed")
        except Exception as e:
            print(f"  [WEIGHT] {mesh_obj.name}: Could not smooth: {e}")

        bpy.ops.object.mode_set(mode='OBJECT')
        mesh_obj.select_set(False)


# ============================================================
# 6. VERIFICATION
# ============================================================

def verify_rig():
    """Verify the rig is correctly set up."""
    armature = bpy.data.objects.get('AvatarArmature')
    if not armature:
        print("ERROR: Armature not found")
        return False

    # Count bones
    bone_count = len(armature.data.bones)
    print(f"\n=== RIG VERIFICATION ===")
    print(f"  Total bones: {bone_count}")

    # Check IK constraints
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='POSE')

    ik_count = 0
    for pb in armature.pose.bones:
        for c in pb.constraints:
            if c.type == 'IK':
                ik_count += 1
                print(f"  [IK] {pb.name}: {c.name} (chain={c.chain_count})")

    print(f"  IK constraints: {ik_count}")

    # Check rotation limits
    limited_count = 0
    for pb in armature.pose.bones:
        if pb.use_limit_rotation:
            limited_count += 1

    print(f"  Bones with rotation limits: {limited_count}")

    bpy.ops.object.mode_set(mode='OBJECT')

    # Verify parent hierarchy
    print(f"\n  Bone Hierarchy:")
    for bone in armature.data.bones:
        parent_name = bone.parent.name if bone.parent else "ROOT"
        indent = "    "
        current = bone.parent
        while current:
            indent += "  "
            current = current.parent
        print(f"  {indent}{bone.name} (parent: {parent_name})")

    return True


# ============================================================
# MAIN EXECUTION
# ============================================================

def main():
    print("=" * 60)
    print("SignBridge Body Rigging Script")
    print("=" * 60)

    print("\n[1/5] Creating armature...")
    create_armature()

    print("\n[2/5] Setting up IK constraints...")
    setup_ik_constraints()

    print("\n[3/5] Setting rotation limits...")
    set_rotation_limits()

    print("\n[4/5] Parenting mesh to armature...")
    parent_mesh_to_armature()

    print("\n[5/5] Smoothing weights...")
    smooth_weights()

    print("\n[VERIFY] Verifying rig...")
    verify_rig()

    print("\n" + "=" * 60)
    print("Body rigging complete!")
    print("Save as: blender/avatar_body_rig.blend")
    print("=" * 60)


if __name__ == "__main__":
    main()
