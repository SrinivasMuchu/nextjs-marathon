"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Hierarchy.module.css";
import Tree from "react-d3-tree";
import { useCenteredTree } from "./helper";
import { BASE_URL,ASSET_PREFIX_URL } from "@/config";
// import { BASE_URL, PHOTO_LINK, ASSET_PREFIX_URL } from "../../../constants/config";
// import AddMember from "../EditComponents/AddMember";
// import Loading from "../Loading/Loading";
// import ViewRole from "../ViewRole/ViewRole";
// import EditDoc from "../EditComponents/EditDoc";
// import RemoveChangeManager from "../EditComponents/RemoveChangemanager";
// import EditManager from "../EditComponents/EditManager";
// import EditRole from "../EditComponents/EditRole";
// import AddCollaborate from "../AddCollaborators/AddCollaborate";
// import DeleteConfirmation from "../EditComponents/DeleteConfirmation";
import RenderNodes from "./RenderNodes";
import AddMember from "./modifyHeirarchyPopUps/AddMembers";
import AddDepartment from "./modifyHeirarchyPopUps/AddDepartment";
import ViewRole from "./modifyHeirarchyPopUps/ViewRole";
import DeletePopUp from "./modifyHeirarchyPopUps/DeletePopUp";
import EditRole from "./modifyHeirarchyPopUps/EditRole";
import EditManager from "./modifyHeirarchyPopUps/EditManager";
import ChangeManager from "./modifyHeirarchyPopUps/ChangeManager";






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
  isAdmin, isCollaborator,
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
    if (isAdmin === 1 || isCollaborator === 1) {
      setIsHovered(true);
      setShowPlus(true);
      setDepartment(true);
      // Update the active node only if it's different
      if (nodeDatum !== activeNode) {
        setActiveNode(nodeDatum);

      }
      
      // Handle tour logic based on node type

    }
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
    if (isAdmin) {
      setClickedData(nodeDatum);
      setAction(action);
    }

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
  const [isAdmin, setIsSetAdmin] = useState('');
  const [isCollaborator, setIsCollaborator] = useState('');
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
  const [collabOpen, setCollabOpen] = useState(false);
  const [collabAdmin, setCollabAdmin] = useState('');
  const [updatedData,setUpdatedData] = useState(false)
  const [parentId, setParentId] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchOrg();


  }, [parentId,updatedData]);




 
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

const fetchOrg = async () => {
    try {
        const HEADERS = { "x-auth-token": localStorage.getItem('token') };
        const response = await axios.get(BASE_URL + '/v1/org/get-hierarchy', {
            params: { parent_entity_id: parentId },
            headers: HEADERS,
        });

        if (response.data.meta.code == 200) {
            setHierarchy(prevHierarchy => {
                if (parentId) {
                    return updateHierarchy(prevHierarchy, parentId, response.data.data.hierarchy);
                } else {
                    return response.data.data.hierarchy; // Initial load
                }
            });

            setIsSetAdmin(response.data.data.is_admin);
            setIsCollaborator(response.data.data.isCollaborator);
        }
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
  const fetchData = async () => {
    try {
      const HEADERS = { "x-auth-token": localStorage.getItem('token')}
      await axios.get(BASE_URL + "/v1/org/add-collab", {
        headers: HEADERS,
      });

    } catch (error) {
      console.error("Error fetching options data:", error);
    }
  };

  const fetchAddedData = async () => {
    try {
      const HEADERS = { "x-auth-token": localStorage.getItem('token')}
      await axios.get(BASE_URL + "/v1/org/get-collab", {
        headers: HEADERS,
      });

      // fetchAddedData()
    } catch (error) {
      console.error("Error fetching options data:", error);
    }
  };

  async function handleCollabOpen() {
    setCollabOpen(!collabOpen);
    fetchData();
    await fetchAddedData()
  }
  useEffect(() => {
    fetchMmebers()
  }, []);
  const fetchMmebers = async () => {
    try {
      const HEADERS = { "x-auth-token": localStorage.getItem('token')}
      const response = await axios.get(BASE_URL + "/v1/org/getmember-details", { headers: HEADERS });
      const data = response.data.data;
      setCollabAdmin(data.is_admin)

    } catch (error) {
      console.error("Error fetching options data:", error);
    }
  };
  const calculateInitialZoom = (hierarchy) => {
    // You can adjust this factor as needed
    const zoomFactor = 0.1;
    return Math.max(1, hierarchy.length * zoomFactor);
  };
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
      <div style={{width:'100%',height:'99vh'}} ref={containerRef} className={styles["org-hierarchy"]}  onClick={handleToggleOfMenu}>
        {loading ? (
          // <img src={loadingImg} />
        //   <Loading />
        <span>loading....</span>
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
                  isAdmin, isCollaborator,
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
            {collabAdmin ? (
              <button className={styles["btn-collab"]}   onClick={handleCollabOpen} data-tour="step-10">
                Add Collaborator
              </button>
            ) : (
              '' // Show an empty fragment if not an admin (i.e., nothing will be rendered)
            )} 
            {(action === 'add_mem' || action === 'add_assist') && <AddMember activeNode={clickedData} setAction={setAction} action={action} setUpdatedData={setUpdatedData}/>}
            {action === 'add_dept' && <AddDepartment activeNode={clickedData} setAction={setAction} setUpdatedData={setUpdatedData} />}
            {action === 'view_role' && <ViewRole activeNode={clickedData} setAction={setAction} />}
            {action === 'edit_role' && <EditRole activeNode={clickedData} setAction={setAction} setUpdatedData={setUpdatedData}/>}
            {action === 'change_manager' && <EditManager activeNode={clickedData} hierarchy={hierarchy} setAction={setAction} setUpdatedData={setUpdatedData}/>}
            {deletePopUp && <DeletePopUp activeNode={clickedData} setHasChildren={setHasChildren} onclose={handleCloseDelete} setUpdatedData={setUpdatedData}/>}
            {action === 'transfer_to' && <ChangeManager activeNode={clickedData} hierarchy={hierarchy} setAction={setAction} setUpdatedData={setUpdatedData}/>}
            
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
