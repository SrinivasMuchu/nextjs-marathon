export const THREE_MF_PAIR_FAQS = {
  "3mf-to-3dm": [
    {
      "question": "How do I convert a 3MF file to 3DM?",
      "answer": "Upload the .3mf file to the converter at the top of this page and download a Rhino 7 .3dm with the model as one mesh object, in millimetres. Marathon OS is a paid route: first 2 files free, then {{price}}1 credit per file."
    },
    {
      "question": "Will the 3DM have NURBS surfaces?",
      "answer": "No. A 3MF is triangles, and our 3DM keeps them as a mesh. For faces you can edit, convert 3MF to STEP and open the STEP in Rhino."
    },
    {
      "question": "Is the Marathon OS 3MF to 3DM converter free?",
      "answer": "First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire."
    },
    {
      "question": "Which Rhino versions open the file?",
      "answer": "It's a Rhino 7 file, so Rhino 7 and Rhino 8 open it. Rhino 6 and earlier can't open Rhino 7 files."
    },
    {
      "question": "What units does the 3DM use?",
      "answer": "Millimetres, stored as the file's model units. A 3MF stores its unit, and we convert it, so a 3MF saved in inches or centimetres comes out at the right size in millimetres."
    },
    {
      "question": "What happens to the separate objects in my 3MF?",
      "answer": "Every object in the build comes across in its place, merged into one mesh object. Object names, colours and print settings aren't carried over."
    },
    {
      "question": "Does the converter change the mesh?",
      "answer": "Only to merge the objects into one mesh. We write the same triangles to 3DM: nothing is repaired, smoothed, reduced or remeshed."
    },
    {
      "question": "Can I edit the mesh in Rhino?",
      "answer": "You can move, scale, cut and join it with Rhino's mesh tools. MeshToNURB turns each triangle into a flat surface, which isn't a smooth NURBS model."
    },
    {
      "question": "Do I get a quality report?",
      "answer": "Yes. Every conversion comes with a free quality report with 11 checks, including whether the source and the output are watertight, manifold edges, degenerate triangles and a bounding-box match with the 3MF."
    },
    {
      "question": "Which 3MF files can I upload?",
      "answer": ".3mf files up to 300 MB, from Bambu Studio, PrusaSlicer, OrcaSlicer, Cura, CAD programs or model sites such as MakerWorld and Printables."
    },
    {
      "question": "Do I need an account?",
      "answer": "To upload your own file, sign in with Google or an emailed code. The sample file works without signing in."
    },
    {
      "question": "How long does a 3MF to 3DM conversion take?",
      "answer": "It depends on the file. Large meshes take longer, and we email you when the file is ready."
    },
    {
      "question": "Are my 3MF files private?",
      "answer": "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy."
    }
  ],
  "3mf-to-brep": [
    {
      "question": "How do I convert a 3MF file to BREP?",
      "answer": "Upload the .3mf file to the converter at the top of this page and download the BREP file. FreeCAD, which is free, can import a mesh, turn it into a shape and export BREP, but every triangle becomes a face there. Marathon OS is the paid route: first 2 files free, then {{price}}1 credit per file."
    },
    {
      "question": "Is the Marathon OS 3MF to BREP converter free?",
      "answer": "First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire."
    },
    {
      "question": "What is a BREP file?",
      "answer": "A .brep (or .brp) file is Open CASCADE's native format for a boundary representation: the surfaces, edges and vertices of a shape. FreeCAD, CadQuery, gmsh and other tools built on Open CASCADE read it."
    },
    {
      "question": "Do I need to choose units?",
      "answer": "No. A 3MF stores its unit, and we convert it, so a 3MF saved in inches or centimetres comes out at the right size in millimetres."
    },
    {
      "question": "Why does the BREP open as surfaces instead of a solid?",
      "answer": "Two reasons: the mesh isn't watertight, or it went through the faceted fallback (every mesh over 1 million triangles, and any mesh the rebuild can't fit), which currently writes surfaces. Repair the mesh, or reduce it below 1 million triangles, and convert again."
    },
    {
      "question": "Why are the holes still faceted?",
      "answer": "The rebuild couldn't fit a cylinder to that mesh. Holes with more segments in the 3MF fit better, and a CAD designer can rebuild them exactly."
    },
    {
      "question": "Do you repair the mesh first?",
      "answer": "Meshes up to 800,000 triangles are cleaned before the rebuild: degenerate and duplicate triangles are removed, triangles are oriented consistently and small pinholes are closed. Large openings are left alone, because filling them would invent a wall. Bigger meshes go in as they are."
    },
    {
      "question": "Is this an AI 3MF to BREP converter?",
      "answer": "It doesn't use generative AI. The rebuild fits planes, cylinders and free-form surfaces to the mesh with geometry algorithms, so it never invents detail the mesh doesn't have."
    },
    {
      "question": "Can I convert a sculpted model or a scan?",
      "answer": "Yes, but organic shapes have few flat or round areas to fit, so they come back made of many small faces. Meshes over 1 million triangles skip the rebuild and come back as a faceted surface model, up to about 35,000 faces. For engineering use, having a designer rebuild the part usually gives a better result."
    },
    {
      "question": "Can SolidWorks or Fusion open a BREP file?",
      "answer": "Most commercial CAD programs don't import Open CASCADE .brep files. Convert 3MF to STEP for them instead; it uses the same rebuild."
    },
    {
      "question": "Is .brp the same as .brep?",
      "answer": "Yes. Both extensions are used for the same Open CASCADE format."
    },
    {
      "question": "Which 3MF files can I upload?",
      "answer": ".3mf files up to 300 MB, from Bambu Studio, PrusaSlicer, OrcaSlicer, Cura, CAD programs or model sites such as MakerWorld and Printables."
    },
    {
      "question": "Do I need an account?",
      "answer": "To upload your own file, sign in with Google or an emailed code. The sample file works without signing in."
    },
    {
      "question": "How long does a 3MF to BREP conversion take?",
      "answer": "It depends on the mesh. Large or dense meshes can take 10 minutes or more, and we email you when the file is ready."
    },
    {
      "question": "Are my 3MF files private?",
      "answer": "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy."
    }
  ],
  "3mf-to-iges": [
    {
      "question": "How do I convert a 3MF file to IGES?",
      "answer": "Upload the .3mf file to the converter at the top of this page and download the IGES file. FreeCAD, which is free, can import a mesh, turn it into a shape and export IGES, but every triangle becomes a face there. Marathon OS is the paid route: first 2 files free, then {{price}}1 credit per file."
    },
    {
      "question": "Is the Marathon OS 3MF to IGES converter free?",
      "answer": "First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire."
    },
    {
      "question": "What is the difference between IGS and IGES?",
      "answer": "None. .igs and .iges are two extensions for the same format, and IGES readers accept both."
    },
    {
      "question": "Do I need to choose units?",
      "answer": "No. A 3MF stores its unit, and we convert it, so a 3MF saved in inches or centimetres comes out at the right size in millimetres."
    },
    {
      "question": "Will the IGES open as a solid?",
      "answer": "It can. When the rebuild gives a closed solid that passes our read-back check, it's written in IGES B-rep mode (type 186), which CAD programs open as a solid. If the mesh isn't watertight, or it went through the faceted fallback (every mesh over 1 million triangles, and any mesh the rebuild can't fit), you get trimmed surfaces to knit in your CAD program."
    },
    {
      "question": "Why are the holes still faceted?",
      "answer": "The rebuild couldn't fit a cylinder to that mesh. Holes with more segments in the 3MF fit better, and a CAD designer can rebuild them exactly."
    },
    {
      "question": "Do you repair the mesh first?",
      "answer": "Meshes up to 800,000 triangles are cleaned before the rebuild: degenerate and duplicate triangles are removed, triangles are oriented consistently and small pinholes are closed. Large openings are left alone, because filling them would invent a wall. Bigger meshes go in as they are."
    },
    {
      "question": "Is this an AI 3MF to IGES converter?",
      "answer": "It doesn't use generative AI. The rebuild fits planes, cylinders and free-form surfaces to the mesh with geometry algorithms, so it never invents detail the mesh doesn't have."
    },
    {
      "question": "Can I convert a sculpted model or a scan?",
      "answer": "Yes, but organic shapes have few flat or round areas to fit, so they come back made of many small faces. Meshes over 1 million triangles skip the rebuild and come back as a faceted surface model, up to about 35,000 faces. For engineering use, having a designer rebuild the part usually gives a better result."
    },
    {
      "question": "Should I send a supplier STEP or IGES?",
      "answer": "STEP, if they accept it: it's the current standard, and 3MF to STEP uses the same rebuild. Send IGES when their CAM or CAD system asks for it."
    },
    {
      "question": "Can I convert a Bambu Studio or PrusaSlicer project?",
      "answer": "Yes. Slicer projects are 3MF files. We read every mesh in the build, so modifier meshes, negative volumes and support blockers come through as ordinary geometry. Remove them in the slicer first if you don't want them in the result."
    },
    {
      "question": "Which 3MF files can I upload?",
      "answer": ".3mf files up to 300 MB, from Bambu Studio, PrusaSlicer, OrcaSlicer, Cura, CAD programs or model sites such as MakerWorld and Printables."
    },
    {
      "question": "Do I need an account?",
      "answer": "To upload your own file, sign in with Google or an emailed code. The sample file works without signing in."
    },
    {
      "question": "How long does a 3MF to IGES conversion take?",
      "answer": "It depends on the mesh. Large or dense meshes can take 10 minutes or more, and we email you when the file is ready."
    },
    {
      "question": "Are my 3MF files private?",
      "answer": "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy."
    }
  ],
  "3mf-to-obj": [
    {
      "question": "How do I convert a 3MF file to OBJ?",
      "answer": "Upload the .3mf file to the converter at the top of this page and download one OBJ mesh in millimetres. Blender, which is free, can also import 3MF with an add-on and export OBJ. Marathon OS is the paid route if you'd rather not install anything: first 2 files free, then {{price}}1 credit per file."
    },
    {
      "question": "Is the Marathon OS 3MF to OBJ converter free?",
      "answer": "First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire."
    },
    {
      "question": "Why is my OBJ 1000 times too big in Blender?",
      "answer": "OBJ files don't store units. Ours is written in millimetres, and Blender reads 1 unit as 1 metre. Set Scale to 0.001 in Blender's OBJ importer, or scale the object after import."
    },
    {
      "question": "What happens to the separate objects in my 3MF?",
      "answer": "Every object in the build comes across in its place, merged into one mesh object. Object names, colours and print settings aren't carried over."
    },
    {
      "question": "Will colours carry over?",
      "answer": "No. We read the geometry only, so the OBJ has no colours, materials or painted regions. Keep the 3MF for colour prints."
    },
    {
      "question": "What units is the OBJ in?",
      "answer": "Millimetres. A 3MF stores its unit, and we convert it, so a 3MF saved in inches or centimetres comes out at the right size in millimetres."
    },
    {
      "question": "Can I convert a Bambu Studio or PrusaSlicer project?",
      "answer": "Yes. Slicer projects are 3MF files. We read every mesh in the build, so modifier meshes, negative volumes and support blockers come through as ordinary geometry. Remove them in the slicer first if you don't want them in the result."
    },
    {
      "question": "Does the converter change the mesh?",
      "answer": "Only to merge the objects into one mesh. We write the same triangles to OBJ: nothing is repaired, smoothed, reduced or remeshed."
    },
    {
      "question": "Do I get a quality report?",
      "answer": "Yes. Every conversion comes with a free quality report with 11 checks, including whether the source and the output are watertight, manifold edges, degenerate triangles and a bounding-box match with the 3MF."
    },
    {
      "question": "Can I convert OBJ back to 3MF?",
      "answer": "Yes. Our OBJ to 3MF conversion reads the OBJ as millimetres and writes it as one 3MF object."
    },
    {
      "question": "Which 3MF files can I upload?",
      "answer": ".3mf files up to 300 MB, from Bambu Studio, PrusaSlicer, OrcaSlicer, Cura, CAD programs or model sites such as MakerWorld and Printables."
    },
    {
      "question": "Do I need an account?",
      "answer": "To upload your own file, sign in with Google or an emailed code. The sample file works without signing in."
    },
    {
      "question": "How long does a 3MF to OBJ conversion take?",
      "answer": "It depends on the file. Large meshes take longer, and we email you when the file is ready."
    },
    {
      "question": "Are my 3MF files private?",
      "answer": "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy."
    }
  ],
  "3mf-to-off": [
    {
      "question": "What is an OFF file?",
      "answer": "OFF (Object File Format) is a plain-text polygon mesh format that came from Geomview. It lists the vertex and face counts, then every vertex, then every face. Geometry libraries such as CGAL and libigl read it, and datasets such as ModelNet use it."
    },
    {
      "question": "How do I convert a 3MF file to OFF?",
      "answer": "Upload the .3mf file to the converter at the top of this page and download one OFF mesh in millimetres. Marathon OS is a paid route: first 2 files free, then {{price}}1 credit per file."
    },
    {
      "question": "Is the Marathon OS 3MF to OFF converter free?",
      "answer": "First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire."
    },
    {
      "question": "Is the OFF file ASCII?",
      "answer": "Yes. OFF is a plain-text format, so you can open it in a text editor or parse it with a few lines of code."
    },
    {
      "question": "What happens to the separate objects in my 3MF?",
      "answer": "Every object in the build comes across in its place, merged into one mesh. Object names, colours and print settings aren't carried over."
    },
    {
      "question": "What units is the OFF in?",
      "answer": "Millimetres. A 3MF stores its unit, and we convert it, so a 3MF saved in inches or centimetres comes out at the right size in millimetres. OFF has no unit field, so normalise or scale the mesh in your own code if you need a different scale."
    },
    {
      "question": "Does the converter change the mesh?",
      "answer": "Only to merge the objects into one mesh. We write the same triangles to OFF: nothing is repaired, smoothed, reduced or remeshed."
    },
    {
      "question": "Do I get a quality report?",
      "answer": "Yes. Every conversion comes with a free quality report with 11 checks, including whether the source and the output are watertight, manifold edges, degenerate triangles and a bounding-box match with the 3MF."
    },
    {
      "question": "Can I convert OFF back to 3MF?",
      "answer": "Yes. Our OFF to 3MF conversion reads the OFF as millimetres and writes it as one 3MF object."
    },
    {
      "question": "Which 3MF files can I upload?",
      "answer": ".3mf files up to 300 MB, from Bambu Studio, PrusaSlicer, OrcaSlicer, Cura, CAD programs or model sites such as MakerWorld and Printables."
    },
    {
      "question": "Do I need an account?",
      "answer": "To upload your own file, sign in with Google or an emailed code. The sample file works without signing in."
    },
    {
      "question": "How long does a 3MF to OFF conversion take?",
      "answer": "It depends on the file. Large meshes take longer, and we email you when the file is ready."
    },
    {
      "question": "Are my 3MF files private?",
      "answer": "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy."
    }
  ],
  "3mf-to-ply": [
    {
      "question": "How do I convert a 3MF file to PLY?",
      "answer": "Upload the .3mf file to the converter at the top of this page and download one binary PLY in millimetres. Marathon OS is a paid route: first 2 files free, then {{price}}1 credit per file."
    },
    {
      "question": "Is the Marathon OS 3MF to PLY converter free?",
      "answer": "First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire."
    },
    {
      "question": "Is the PLY binary or ASCII?",
      "answer": "Binary, little-endian: the compact form MeshLab, CloudCompare and Open3D read. If you need ASCII, open it in MeshLab and export with Binary encoding turned off."
    },
    {
      "question": "What happens to the separate objects in my 3MF?",
      "answer": "Every object in the build comes across in its place, merged into one mesh. Object names, colours and print settings aren't carried over."
    },
    {
      "question": "Will colours carry over?",
      "answer": "No. We read the geometry only, so the PLY has no colours, materials or painted regions. Keep the 3MF for colour prints."
    },
    {
      "question": "What units is the PLY in?",
      "answer": "Millimetres. A 3MF stores its unit, and we convert it, so a 3MF saved in inches or centimetres comes out at the right size in millimetres. PLY has no unit field, so set the unit in the program you open it in if it expects metres."
    },
    {
      "question": "Does the converter change the mesh?",
      "answer": "Only to merge the objects into one mesh. We write the same triangles to PLY: nothing is repaired, smoothed, reduced or remeshed."
    },
    {
      "question": "Do I get a quality report?",
      "answer": "Yes. Every conversion comes with a free quality report with 11 checks, including whether the source and the output are watertight, manifold edges, degenerate triangles and a bounding-box match with the 3MF."
    },
    {
      "question": "Can I convert PLY back to 3MF?",
      "answer": "Yes. Our PLY to 3MF conversion reads the PLY as millimetres and writes it as one 3MF object."
    },
    {
      "question": "Which 3MF files can I upload?",
      "answer": ".3mf files up to 300 MB, from Bambu Studio, PrusaSlicer, OrcaSlicer, Cura, CAD programs or model sites such as MakerWorld and Printables."
    },
    {
      "question": "Do I need an account?",
      "answer": "To upload your own file, sign in with Google or an emailed code. The sample file works without signing in."
    },
    {
      "question": "How long does a 3MF to PLY conversion take?",
      "answer": "It depends on the file. Large meshes take longer, and we email you when the file is ready."
    },
    {
      "question": "Are my 3MF files private?",
      "answer": "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy."
    }
  ],
  "3mf-to-step": [
    {
      "question": "How do I convert a 3MF file to STEP?",
      "answer": "Upload the .3mf file to the converter at the top of this page and download the .step file. FreeCAD, which is free, can import a mesh and turn it into a shape, but every triangle becomes a face there. Marathon OS is the paid route: first 2 files free, then {{price}}1 credit per file."
    },
    {
      "question": "Is the Marathon OS 3MF to STEP converter free?",
      "answer": "First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire."
    },
    {
      "question": "Can I convert 3MF to STP?",
      "answer": "Yes. .stp is the short extension for STEP; both are the same format."
    },
    {
      "question": "Which STEP version do I get?",
      "answer": "STEP AP214, in millimetres."
    },
    {
      "question": "Do I need to choose units?",
      "answer": "No. A 3MF stores its unit, and we convert it, so a 3MF saved in inches or centimetres comes out at the right size in millimetres."
    },
    {
      "question": "Why does the STEP open as surfaces instead of a solid?",
      "answer": "Two reasons: the mesh isn't watertight, or it went through the faceted fallback (every mesh over 1 million triangles, and any mesh the rebuild can't fit), which currently writes surfaces. Repair the mesh, or reduce it below 1 million triangles, and convert again."
    },
    {
      "question": "Why are the holes still faceted?",
      "answer": "The rebuild couldn't fit a cylinder to that mesh. Holes with more segments in the 3MF fit better, and a CAD designer can rebuild them exactly."
    },
    {
      "question": "Do you repair the mesh first?",
      "answer": "Meshes up to 800,000 triangles are cleaned before the rebuild: degenerate and duplicate triangles are removed, triangles are oriented consistently and small pinholes are closed. Large openings are left alone, because filling them would invent a wall. Bigger meshes go in as they are."
    },
    {
      "question": "Is this an AI 3MF to STEP converter?",
      "answer": "It doesn't use generative AI. The rebuild fits planes, cylinders and free-form surfaces to the mesh with geometry algorithms, so it never invents detail the mesh doesn't have."
    },
    {
      "question": "Can I convert a sculpted model or a scan?",
      "answer": "Yes, but organic shapes have few flat or round areas to fit, so they come back made of many small faces. Meshes over 1 million triangles skip the rebuild and come back as a faceted surface model, up to about 35,000 faces. For engineering use, having a designer rebuild the part usually gives a better result."
    },
    {
      "question": "What happens to the separate objects in my 3MF?",
      "answer": "Every object in the build is rebuilt in its place, in one STEP file. Object names, colours and print settings aren't carried over."
    },
    {
      "question": "Can I convert a Bambu Studio or PrusaSlicer project?",
      "answer": "Yes. Slicer projects are 3MF files. We read every mesh in the build, so modifier meshes, negative volumes and support blockers come through as ordinary geometry. Remove them in the slicer first if you don't want them in the result."
    },
    {
      "question": "Which 3MF files can I upload?",
      "answer": ".3mf files up to 300 MB, from Bambu Studio, PrusaSlicer, OrcaSlicer, Cura, CAD programs or model sites such as MakerWorld and Printables."
    },
    {
      "question": "Do I need an account?",
      "answer": "To upload your own file, sign in with Google or an emailed code. The sample file works without signing in."
    },
    {
      "question": "How long does a 3MF to STEP conversion take?",
      "answer": "It depends on the mesh. Large or dense meshes can take 10 minutes or more, and we email you when the file is ready."
    },
    {
      "question": "Are my 3MF files private?",
      "answer": "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy."
    }
  ],
  "3mf-to-stl": [
    {
      "question": "How do I convert a 3MF file to STL?",
      "answer": "Upload the .3mf file to the converter at the top of this page and download one binary STL in millimetres. Bambu Studio, PrusaSlicer and OrcaSlicer can also open a 3MF and export STL themselves. Marathon OS is the paid route if you don't have a slicer at hand: first 2 files free, then {{price}}1 credit per file."
    },
    {
      "question": "Is the Marathon OS 3MF to STL converter free?",
      "answer": "First 2 files free, any size up to 300 MB. After that, {{price}}1 credit per file. Credit packs bring it down to $1.80 per file. Prices include tax, you pay only when you click Download and credits never expire."
    },
    {
      "question": "Why do I get one STL instead of several?",
      "answer": "We merge every object in the build into one STL, each in its place. Bambu Studio, PrusaSlicer and OrcaSlicer can split it into parts, or export one STL per object from the 3MF."
    },
    {
      "question": "Will colours carry over?",
      "answer": "No. We read the geometry only, so the STL has no colours, materials or painted regions. Keep the 3MF for colour prints."
    },
    {
      "question": "What units is the STL in?",
      "answer": "Millimetres. A 3MF stores its unit, and we convert it, so a 3MF saved in inches or centimetres comes out at the right size in millimetres. STL has no unit field, and most slicers read STL as millimetres, so it comes in at the right size."
    },
    {
      "question": "Can I convert a Bambu Studio or PrusaSlicer project?",
      "answer": "Yes. Slicer projects are 3MF files. We read every mesh in the build, so modifier meshes, negative volumes and support blockers come through as ordinary geometry. Remove them in the slicer first if you don't want them in the result."
    },
    {
      "question": "Is the STL binary or ASCII?",
      "answer": "Binary. It's smaller than ASCII, and every slicer reads it."
    },
    {
      "question": "Does the converter change the mesh?",
      "answer": "Only to merge the objects into one mesh. We write the same triangles to STL: nothing is repaired, smoothed, reduced or remeshed."
    },
    {
      "question": "Do I get a quality report?",
      "answer": "Yes. Every conversion comes with a free quality report with 11 checks, including whether the source and the output are watertight, manifold edges, degenerate triangles and a bounding-box match with the 3MF."
    },
    {
      "question": "Can I convert STL back to 3MF?",
      "answer": "Yes. Our STL to 3MF conversion writes the same triangles as one 3MF object, with millimetres stored."
    },
    {
      "question": "Which 3MF files can I upload?",
      "answer": ".3mf files up to 300 MB, from Bambu Studio, PrusaSlicer, OrcaSlicer, Cura, CAD programs or model sites such as MakerWorld and Printables."
    },
    {
      "question": "Do I need an account?",
      "answer": "To upload your own file, sign in with Google or an emailed code. The sample file works without signing in."
    },
    {
      "question": "How long does a 3MF to STL conversion take?",
      "answer": "It depends on the file. Large meshes take longer, and we email you when the file is ready."
    },
    {
      "question": "Are my 3MF files private?",
      "answer": "Uploads and downloads use HTTPS. Uploaded and converted files are deleted automatically after 7 days, and converted files aren't added to the public CAD library unless you publish them. You keep ownership of your design. See the Privacy Policy."
    }
  ]
};
