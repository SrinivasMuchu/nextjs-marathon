"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Hierarchy.module.css";
import Tree from "react-d3-tree";
import { useCenteredTree } from "./helper";
import { BASE_URL, ASSET_PREFIX_URL } from "@/config";
import { saveAs } from "file-saver";
import RenderNodes from "./RenderNodes";
import AddMember from "./modifyHeirarchyPopUps/AddMembers";
import AddDepartment from "./modifyHeirarchyPopUps/AddDepartment";
import ViewRole from "./modifyHeirarchyPopUps/ViewRole";
import DeletePopUp from "./modifyHeirarchyPopUps/DeletePopUp";
import EditRole from "./modifyHeirarchyPopUps/EditRole";
import EditManager from "./modifyHeirarchyPopUps/EditManager";
import ChangeManager from "./modifyHeirarchyPopUps/ChangeManager";
import DemoPopUp from "../HomePages/RequestDemo/DemoPopUp";
import OrgTopNav from "./Common/OrgTopNav";
import Loading from "../CommonJsx/Loaders/Loading";
import { toast } from "react-toastify";







const RenderRectSvgNode = ({
  nodeDatum,
  toggleNode,
  setActiveNode,
  activeNode,
  isHovered,
  setIsHovered,
  setClickedData,
  setDepartment,
  setShowPlus,
  add, edit, setEdit,
  setAdd,
  addmenuopen, editMenuOpen,
  hasChildren, setHasChildren, setIsChangingManager, setAction,
  setDeletePopUp, setParentId
}) => {

  const handleRemoveRole = async (e) => {
    setClickedData(nodeDatum);
    try {
      if (activeNode.count > 0) {
        e.stopPropagation();
        setHasChildren(true);

      } else {
        setDeletePopUp(true)
        setIsChangingManager(false);


      }
    } catch (error) {
      console.log(error);
    }
  };




  const handleRectClick = () => {
    // toggleNode()
    setParentId(nodeDatum.entity_id)

  };

  const handleMouseEnter = () => {
    // if (isAdmin === 1 || isCollaborator === 1) {
    setIsHovered(true);
    setShowPlus(true);
    setDepartment(true);
    // Update the active node only if it's different
    if (nodeDatum !== activeNode) {
      setActiveNode(nodeDatum);

    }

    // Handle tour logic based on node type

    // }
  };

  const handleMouseLeave = () => {
    // Don't update state on mouse leave

    setIsHovered(false);
    setShowPlus(false);
    setDepartment(false);

  };

  // Set activeNode state to null initially or based on your logic
  // const [activeNode, setActiveNode] = useState(null);


  const strokeColor = activeNode === nodeDatum ? (isHovered ? "#FF7A7A" : "#C4C9CC") : "#C4C9CC";
  const strokeDepColor = activeNode === nodeDatum ? (isHovered ? "#FF7A7A" : "#00B6B6") : "#00B6B6";
  const fillColor = activeNode === nodeDatum ? (isHovered ? "white" : "#E6EFFD") : "#E6EFFD";
  addmenuopen = nodeDatum === add;
  // isMenuOpen = nodeDatum === menuopen;
  const handleAdd = () => {
    setAdd(nodeDatum === add ? null : nodeDatum);
    setEdit(null)
  };

  editMenuOpen = nodeDatum === edit;
  const handleEdit = () => {
    setEdit(nodeDatum === edit ? null : nodeDatum)
    setAdd(null)
  }



  function handleMenuActions(action) {
    // if (isAdmin) {
    setClickedData(nodeDatum);
    setAction(action);
    // }

  }



  return (
    <>
      <RenderNodes nodeDatum={nodeDatum} activeNode={activeNode} handleRectClick={handleRectClick} handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave} strokeColor={strokeColor} isHovered={isHovered} handleRemoveRole={handleRemoveRole}
        handleMenuActions={handleMenuActions} editMenuOpen={editMenuOpen} addmenuopen={addmenuopen} handleEdit={handleEdit}
        fillColor={fillColor} strokeDepColor={strokeDepColor} hasChildren={hasChildren} handleAdd={handleAdd}
      />

    </>
  );
};




function Hierarchy({ department }) {
  const [loading, setLoading] = useState(true);
  const [hierarchy, setHierarchy] = useState({});


  const [activeNode, setActiveNode] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(`${ASSET_PREFIX_URL}Add action-d3.svg`);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuopen, setMenuopen] = useState(false);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showPlus, setShowPlus] = useState(false);
  const [isChangingManager, setIsChangingManager] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [clickedData, setClickedData] = useState(null);
  const [action, setAction] = useState(false)
  const [isDepartment, setDepartment] = useState(false);
  const [updatedData, setUpdatedData] = useState(false)
  const [parentId, setParentId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [limitError, setLimitError] = useState(false);
  useEffect(() => {
    // setLoading(true);
    fetchOrg(parentId);


  }, [parentId, updatedData]);





  const updateHierarchy = (nodes, parentId, children) => {
    return nodes.map(node => {
      if (node.entity_id === parentId) {
        return { ...node, children }; // Add fetched children to the parent node
      } else if (node.children) {
        return { ...node, children: updateHierarchy(node.children, parentId, children) }; // Recursively update
      }
      return node;
    });
  };
  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/v1/org/export-to-excell`,
        {
          headers: { 'user-uuid': localStorage.getItem('uuid') }, // Move UUID to headers
          responseType: "blob" // Keep blob response for file download
        }
      );




      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `org-hierarchy.xlsx`);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };
  const handleImportExcel = async (event) => {
  
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uuid", localStorage.getItem('uuid'));


    try {
      setLoading(true)
      const response = await axios.post(
        `${BASE_URL}/v1/org/import-excell`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-uuid": localStorage.getItem('uuid') // Include UUID in headers
          }
        }
      );

      if (response.data.meta.success) {
        fetchOrg(parentId)
      } else {
        toast.error(response.data.meta.message)
      }
      setLoading(false)
    } catch (error) {
      console.error("Error importing Excel file:", error);
      toast.error(error.response.data.message);
      setLoading(false)
    }
  };

  const fetchOrg = async (parentId) => {
    try {
      setLoading(true)
      // const HEADERS = { "x-auth-token": localStorage.getItem('token') };
      const response = await axios.get(BASE_URL + '/v1/org/get-hierarchy-next', {
        params: { parent_entity_id: parentId }, // Keep only the required query params
        headers: { 'user-uuid': localStorage.getItem('uuid') } // Move UUID to headers
      });


      if (response.data.meta.code == 200) {

        if (response.data.data.hierarchy.length) {
       
          setHierarchy(prevHierarchy => {

            if (parentId) {
              return updateHierarchy(prevHierarchy, parentId, response.data.data.hierarchy);
            } else {
              return response.data.data.hierarchy; // Initial load
            }


          });
        } else {
          setHierarchy(hierarchy)
        }

        // setIsSetAdmin(false);
        // setIsCollaborator(response.data.data.isCollaborator);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };



  const [dimensions, translate, containerRef] = useCenteredTree();

  const handleToggleOfMenu = () => {
    // setActiveNode(false)
    if (add) {
      setAdd(null)

    }
    else if (edit) {
      setEdit(null)
    }

  }





  const handleClick = () => {
    setEdit(null)
    setActiveNode(null)
    setAdd(null)
  }

  const handleCloseDelete = () => {
    setDeletePopUp(false)
  }



  return (
    <>
      {/* <OrgTopNav /> */}
      <OrgTopNav orgStyles={styles} handleDownloadExcel={handleDownloadExcel} />
      <div style={{ width: '100%', height: '99vh' }} ref={containerRef} className={styles["org-hierarchy"]} onClick={handleToggleOfMenu}>
        {loading ? (
          // <img src={loadingImg} />
          <Loading />

        ) : (
          <>
            <Tree
              data={hierarchy}
              // dimensions={dimensions}
              translate={translate}
              // containerRef={containerRef}
              // scaleExtent={{ min: -1000, max: 5 }}
              zoomable={false}
              // zoom={calculateInitialZoom(hierarchy)}
              zoom={0.75}

              // initialDepth={1}


              renderCustomNodeElement={(props) =>

                RenderRectSvgNode({
                  ...props,
                  setActiveNode,
                  activeNode,
                  isMenuOpen, isDepartment, setDepartment,
                  setIsMenuOpen,
                  isHovered,
                  setIsHovered,
                  showPlus,
                  setShowPlus,
                  menuopen,
                  setMenuopen,
                  add,
                  setAdd,

                  hasChildren, setHasChildren,
                  currentSrc,
                  setCurrentSrc, isChangingManager, setIsChangingManager,
                  department, edit, setEdit,
                  clickedData, setClickedData, action, setAction,
                  parentId, setParentId,
                  deletePopUp, setDeletePopUp
                })
              }
              orientation="vertical"
              pathFunc="step"
              separation={{ siblings: 3.25, nonSiblings: 3.5, parentChild: 200 }}
              onClick={handleClick}
            />

            <span className={styles["note-msg"]}>Note:Marathon OS Chart Builder is designed exclusively for desktop use. Please access it on a PC or laptop for the best experience. 🚀</span>
            {/* <button className={styles["btn-collab"]} onClick={handleImportExcel} >
              Import
            </button> */}
            <input className={styles["btn-collab"]} style={{ display: 'none' }} id="fileupld" type="file" onChange={(e) => handleImportExcel(e)} accept=".xlsx" />
            {(action === 'add_mem' || action === 'add_assist') && <AddMember
              setOpenForm={setOpenForm} fetchOrg={fetchOrg}
              setParentId={setParentId} setLimitError={setLimitError}
              activeNode={clickedData} setAction={setAction} action={action} setUpdatedData={setUpdatedData} />}
            {action === 'add_dept' && <AddDepartment setOpenForm={setOpenForm} setLimitError={setLimitError} fetchOrg={fetchOrg}
              setParentId={setParentId} activeNode={clickedData} setAction={setAction} setUpdatedData={setUpdatedData} />}
            {action === 'view_role' && <ViewRole activeNode={clickedData} setAction={setAction} />}
            {action === 'edit_role' && <EditRole setParentId={setParentId} activeNode={clickedData} setAction={setAction} setUpdatedData={setUpdatedData} />}
            {action === 'change_manager' && <EditManager setParentId={setParentId} activeNode={clickedData} hierarchy={hierarchy} setAction={setAction} setUpdatedData={setUpdatedData} />}
            {deletePopUp && <DeletePopUp activeNode={clickedData} setParentId={setParentId} setHasChildren={setHasChildren} onclose={handleCloseDelete} setUpdatedData={setUpdatedData} />}
            {action === 'transfer_to' && <ChangeManager activeNode={clickedData} setParentId={setParentId} hierarchy={hierarchy} setAction={setAction} setUpdatedData={setUpdatedData} />}

            {openForm === 'demo' && <DemoPopUp onclose={() => setOpenForm(!openForm)} openPopUp={openForm} error={limitError} />}
            {/* 
           
            
            
            
            {action === 'transfer_to' && <RemoveChangeManager activeNode={clickedData} hierarchy={hierarchy} setAction={setAction} setUpdatedData={setUpdatedData}/>}
            {collabOpen && <AddCollaborate />}
            */}

          </>
        )}
      </div>
    </>

  );
}

export default Hierarchy;
