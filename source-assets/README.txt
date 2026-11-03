Shoot Die Repeat 1.3.0 - assets extracted from the APK (Unity 2022+, IL2CPP)

textures/  302 PNG: character/prop palette textures (T_CHR_*, T_PRP_*, T_ENV_*, T_WPN_*), era backdrops (T_BG_*), era icons (T_World_*), UI icons/buttons, skins
audio/     52 sound clips converted to MP3 (original FSB/WAV): weapon fire, hits, enemy deaths, music
levels/    9 level layouts (ground steps, bridges, water, overhead, start mobs, spawn timeline)
models/    scene.json = 157 prefabs (P_*) with full node hierarchy (local pos/rot/scale, mesh, materials, BoxColliders)
           meshes.bin = vertex/normal/uv/index buffers referenced by scene.json (offsets in bytes, Unity coordinates)

Note: the game has NO AnimationClips - characters are voxel rigs (separate rigid body parts) animated procedurally
(VoxelRig / LegStepper / WeaponAnimator) plus CharacterJoint ragdolls. The HTML port reproduces this in game.js.
