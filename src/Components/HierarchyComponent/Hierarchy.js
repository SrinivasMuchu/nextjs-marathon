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
// import NameProfile from "../CommonJsx/NameProfile";
import { textLettersLimit } from "@/common.helper";


const HEADERS = { "x-auth-token": localStorage.getItem('token')}
const containerStyles = {
  width: "100%",
  height: "99vh",
};

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
    setDeletePopUp, textLettersLimit
}) => {

  const handleRemoveRole = async (e) => {
    setClickedData(nodeDatum);
    try {
      if (activeNode.children.length > 0) {
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
    toggleNode()
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

      {(nodeDatum.entity_type === "member" || nodeDatum.entity_type === "assistant") && (
        <g>
          {/* {activeNode === nodeDatum && isHovered && nodeDatum.entity_type !== "assistant" && (
           
          )} */}
          <rect
            width="293"
            height="150"
            x="-150"
            y="-50"
            rx="8"
            ry="8"
            strokeWidth="0" // Set stroke width to 0
            fill="transparent" // Make the rectangle transparent

            onClick={handleRectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              pointerEvents: 'all', // Allow pointer events to trigger even though it's transparent
              // Add any other styles you need
            }}
          />
          <rect
            width="293"
            height="90"
            x="-150"
            y="-50"
            rx="8"
            ry="8"
            strokeWidth="1.5"
            onClick={handleRectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-tour="step-8"
            fill="white"
            style={{
              boxShadow: "0px 2px 4px 0px rgba(72, 123, 253, 0.10)",
              border: "1.5px solid #EDF2F7",
              stroke: strokeColor,
              // Add box shadow style
            }}
          />

          {(activeNode === nodeDatum && isHovered) && (
            <>
              {nodeDatum.entity_type !== "assistant" ? <>
                <g onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                
                  <line
                    x1="0"
                    y1="57"
                    x2="0"
                    y2="40"
                    stroke="#FF7A7A"
                    strokeWidth="2"
                  />
                  <line
                    x1="-30"
                    y1="57"
                    x2="30"
                    y2="57"
                    stroke="#FF7A7A"
                    strokeWidth="2"
                  />
                  <line
                    x1="30"
                    y1="70"
                    x2="30"
                    y2="56"
                    stroke="#FF7A7A"
                    strokeWidth="2"
                  />
                  <image
                    x="19"
                    y="62"
                    width="24"
                    height="24"
                    rx='10'
                    ry='10'
                    xlinkHref={`${ASSET_PREFIX_URL}Add action-d3.svg`}
                    alt=""
                    onClick={handleAdd}

                  />
                  {addmenuopen && nodeDatum.entity_type !== "assistant" && (
                    <g
                      transform="translate(145, -50)"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        border: "1px solid black", // Add the border property here, // Optional: Add padding to make the border visible
                      }}

                    >
                      <foreignObject width="160" height="200" >
                        <div
                          xmlns="http://www.w3.org/1999/xhtml"
                          className={styles["menu-box"]}
                         

                        >
                          <text onClick={() => handleMenuActions('add_mem')}>
                            <img
                              src={`${ASSET_PREFIX_URL}add-member.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />Add Member</text>
                          <text onClick={() => handleMenuActions('add_assist')}>
                            <img
                              src={`${ASSET_PREFIX_URL}add-assistant.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />
                            Add Assistant
                          </text>
                          <text onClick={() => handleMenuActions('add_dept')}>
                            <img
                              src={`${ASSET_PREFIX_URL}add-department.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />
                            Add Department
                          </text>
                         
                        </div>
                      </foreignObject>
                    </g>
                  )}
                  {addmenuopen && nodeDatum.entity_type === "assistant" && (<g
                    transform="translate(150, -55)"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      border: "1px solid black", // Add the border property here, // Optional: Add padding to make the border visible
                    }}

                  >
                    <foreignObject width="160" height="200" >
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        className={styles["menu-box"]}
                      

                      >
                        <text onClick={() => handleMenuActions('view_role')}>
                          <img
                            src={`${ASSET_PREFIX_URL}view-role.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} /> View Role</text>
                        <text onClick={() => handleMenuActions('edit_role')}>
                          <img
                            src={`${ASSET_PREFIX_URL}edit-role.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} />Edit Role</text>

                        <text
                          style={{ color: "#FF3B2F" }}

                          onClick={handleRemoveRole}
                        >
                          <img src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
                          Remove Role
                        </text>

                      </div>
                    </foreignObject>
                  </g>)}
                </g>
                <g onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              

                  <line
                    x1="-30"
                    y1="75"
                    x2="-30"
                    y2="56"
                    stroke="#FF7A7A"
                    strokeWidth="2"
                  />
                  <image

                    x="-42"
                    y="62"
                    width="24"
                    height="24"
                    rx='10'
                    ry='10'
                    xlinkHref={`${ASSET_PREFIX_URL}pencil-edit-org.png`}
                    alt=""
                    onClick={handleEdit}
                    style={{ background: 'white' }}
                  // data-tour="step-9"
                  />
                  {editMenuOpen && nodeDatum.entity_type !== "assistant" && (
                    <g
                      transform="translate(145, -50)"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        border: "1px solid black", // Add the border property here, // Optional: Add padding to make the border visible
                      }}

                    >
                      <foreignObject width="160" height="200" >
                        <div
                          xmlns="http://www.w3.org/1999/xhtml"
                          className={styles["menu-box"]}

                        >
                          <text onClick={() => handleMenuActions('view_role')}>
                            <img
                              src={`${ASSET_PREFIX_URL}view-role.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} /> View Role</text>
                          <text onClick={() => handleMenuActions('edit_role')}>
                            <img
                              src={`${ASSET_PREFIX_URL}edit-role.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />Edit Role</text>
                          <text onClick={() => handleMenuActions('change_manager')}>
                            <img
                              src={`${ASSET_PREFIX_URL}change-manager.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />
                            Change Manager
                          </text>
                          {hasChildren ? (
                            <text
                              style={{ color: "#FF3B2F" }}
                              onClick={() => handleMenuActions('transfer_to')}>
                              <img src={`${ASSET_PREFIX_URL}changing-icon.png`} alt="" style={{ width: "20px", height: "20px" }} />
                              Transfer to ?
                            </text>
                          ) : (
                            <text
                              style={{ color: "#FF3B2F" }}

                              onClick={(e) => handleRemoveRole(e)}
                            >
                              <img src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
                              Remove Role
                            </text>
                          )}
                        </div>
                      </foreignObject>
                    </g>
                  )}
                  {addmenuopen && nodeDatum.entity_type === "assistant" && (<g
                    transform="translate(150, -55)"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      border: "1px solid black", // Add the border property here, // Optional: Add padding to make the border visible
                    }}

                  >
                    <foreignObject width="160" height="200" >
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        className={styles["menu-box"]}

                      >
                        <text onClick={() => handleMenuActions('view_role')}>
                          <img
                            src={`${ASSET_PREFIX_URL}view-role.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} /> View Role</text>
                        <text onClick={() => handleMenuActions('edit_role')}>
                          <img
                            src={`${ASSET_PREFIX_URL}edit-role.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} />Edit Role</text>

                        <text
                          style={{ color: "#FF3B2F" }}

                          onClick={handleRemoveRole}
                        >
                          <img src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
                          Remove Role
                        </text>

                      </div>
                    </foreignObject>
                  </g>)}
                </g>
              </> :
                <>
                  <g onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <line
                      x1="0"
                      y1="57"
                      x2="0"
                      y2="40"
                      stroke="#FF7A7A"
                      strokeWidth="2"
                    />

                    {/* <line
                  x1="-30"
                  y1="75"
                  x2="-30"
                  y2="56"
                  stroke="#FF7A7A"
                  strokeWidth="2"
                /> */}
                    <image

                      x="-12"
                      y="56"
                      width="24"
                      height="24"
                      rx='10'
                      ry='10'
                      xlinkHref={`${ASSET_PREFIX_URL}pencil-edit-org.png`}
                      alt=""
                      onClick={handleEdit}
                      // data-tour="step-9"
                      style={{ background: 'white' }}
                    />
                    {editMenuOpen && nodeDatum.entity_type === "assistant" && (
                      <g
                        transform="translate(145, -50)"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          border: "1px solid black", // Add the border property here, // Optional: Add padding to make the border visible
                        }}

                      >
                        <foreignObject width="160" height="200" >
                          <div
                            xmlns="http://www.w3.org/1999/xhtml"
                            className={styles["menu-box"]}

                          >
                            <text onClick={() => handleMenuActions('view_role')}>
                              <img
                                src={`${ASSET_PREFIX_URL}view-role.svg`}
                                alt=""
                                style={{ width: "20px", height: "20px" }} /> View Role</text>
                            <text onClick={() => handleMenuActions('edit_role')}>
                              <img
                                src={`${ASSET_PREFIX_URL}edit-role.svg`}
                                alt=""
                                style={{ width: "20px", height: "20px" }} />Edit Role</text>
                            {/* <text onClick={() => handleMenuActions('change_manager')}>
                              <img
                                src={`${ASSET_PREFIX_URL}change-manager.svg`}
                                alt=""
                                style={{ width: "20px", height: "20px" }} />
                              Change Manager
                            </text> */}
                            {hasChildren ? (
                              <text
                                style={{ color: "#FF3B2F" }}
                                onClick={() => handleMenuActions('transfer_to')}>
                                <img src={`${ASSET_PREFIX_URL}changing-icon.png`} alt="" style={{ width: "20px", height: "20px" }} />
                                Transfer to ?
                              </text>
                            ) : (
                              <text
                                style={{ color: "#FF3B2F" }}

                                onClick={(e) => handleRemoveRole(e)}
                              >
                                <img src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
                                Remove Role
                              </text>
                            )}
                          </div>
                        </foreignObject>
                      </g>
                    )}
                    {addmenuopen && nodeDatum.entity_type === "assistant" && (<g
                      transform="translate(150, -55)"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        border: "1px solid black", // Add the border property here, // Optional: Add padding to make the border visible
                      }}

                    >
                      <foreignObject width="160" height="200" >
                        <div
                          xmlns="http://www.w3.org/1999/xhtml"
                          className={styles["menu-box"]}

                        >
                          <text onClick={() => handleMenuActions('view_role')}>
                            <img
                              src={`${ASSET_PREFIX_URL}view-role.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} /> View Role</text>
                          <text onClick={() => handleMenuActions('edit_role')}>
                            <img
                              src={`${ASSET_PREFIX_URL}edit-role.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />Edit Role</text>

                          <text
                            style={{ color: "#FF3B2F" }}

                            onClick={handleRemoveRole}
                          >
                            <img src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
                            Remove Role
                          </text>

                        </div>
                      </foreignObject>
                    </g>)}
                  </g>
                </>}

            </>


          )}

          <text
            fill="black"
            strokeWidth="1"
            x="-140"
            y="-45"
            dy="1em"
            textAnchor="start"
            fontFamily="Inter, sans-serif"
            fontWeight="400"
            onClick={handleRectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >

            {textLettersLimit(nodeDatum.jobTitle, 28)}
            {/* {nodeDatum.jobTitle ? (nodeDatum.jobTitle.length > 15 ? nodeDatum.jobTitle.substring(0, 15) + '...' : nodeDatum.jobTitle) : ""} */}
          </text>
          {/* {activeNode === nodeDatum.jobTitle && <ViewRole />} */}

          <text
            fill="#001325"
            strokeWidth="0.5"
            x="-80"
            y="-60"
            dy="5em"
            textAnchor="start"
            fontFamily="Inter, sans-serif"
            font-size="14px"
            onClick={handleRectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {textLettersLimit(nodeDatum.fullName,22)}
            {/* {nodeDatum.fullName || ""} */}
          </text>

          <text
            fill="#001325"
            strokeWidth="0.1"
            x="-79"
            y="-33"
            dy="5em"
            textAnchor="start"
            fontFamily="Inter, sans-serif"
            fontSize="12px"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
             {textLettersLimit(nodeDatum.email,24)}
           
          </text>
        
          <foreignObject
            x="-145"
            y="-18"
            width="50"
            height="50"
            clipPath="url(#circleClip)"
          >
            <div className={styles["image-container-d3"]} onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave} onClick={handleRectClick}>

              {/* <NameProfile userName={nodeDatum.fullName} width='50px' memberPhoto={nodeDatum.photo} fontSize='24px' fontweight='500' /> */}




            </div>
          </foreignObject>
        

          

          {nodeDatum.count > 0 &&
            <g transform="translate(50, -47.5)">
              <rect
                width="34"
                height="20"
                x="50"
                y="3"
                rx="4"
                ry="4"
                fill="#fff"
                strokeWidth='1.5'
                onClick={handleRectClick}
                style={{
                  boxShadow: "0px 2px 4px 0px rgba(72, 123, 253, 0.10)",
                  border: "1.5px solid #EDF2F7",
                  stroke: '#C4C9CC',
                  // Add box shadow style
                }}
              />
              <text
                fill="#001325"
                strokeWidth="0.3"
                x="60"
                y="4"
                dy="1em"
                textAnchor="start"
                fontFamily="Inter, sans-serif"
                font-size="15px"
                onClick={handleRectClick}
              >
                {nodeDatum.count}
              </text>
             
            </g>
          }



         
        </g>
      )}

      {nodeDatum.entity_type === "department" && (
        <g>

         
          <rect
            width="293"
            height="90"
            x="-150"
            y="-30"
            rx="8"
            ry="8"
            strokeWidth="0" // Set stroke width to 0
            fill="transparent" // Make the rectangle transparent
            onClick={handleRectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              pointerEvents: 'all', // Allow pointer events to trigger even though it's transparent
              // Add any other styles you need
            }}
          />
          <rect
            width="293"
            height="40"
            x="-150"
            y="-30"
            rx="8"
            ry="8"
            strokeWidth="1.5"
            onClick={handleRectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            fill={fillColor}
            data-tour="step-8"
            style={{
              boxShadow: "0px 2px 4px 0px rgba(72, 123, 253, 0.10)",
              border: "1.5px solid #EDF2F7",
              stroke: strokeDepColor,
              // Add box shadow style
            }}
          />
          {activeNode === nodeDatum && isHovered && (
            <>
              <g onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {/* <line
                x1="0"
                y1="-50"
                x2="0"
                y2="-67"
                stroke="#FF7A7A"
                strokeWidth="2"
              /> */}
                <line
                  x1="0"
                  y1="27"
                  x2="0"
                  y2="10"
                  stroke="#FF7A7A"
                  strokeWidth="2"
                />
                <line
                  x1="-30"
                  y1="27"
                  x2="30"
                  y2="27"
                  stroke="#FF7A7A"
                  strokeWidth="2"
                />
                <line
                  x1="30"
                  y1="40"
                  x2="30"
                  y2="26"
                  stroke="#FF7A7A"
                  strokeWidth="2"
                />
                <image
                  x="19"
                  y="35"
                  width="24"
                  height="24"
                  rx='10'
                  ry='10'
                  xlinkHref={`${ASSET_PREFIX_URL}Add action-d3.svg`}
                  alt=""
                  onClick={handleAdd}


                />
                {addmenuopen && (
                  <g
                    transform="translate(145, -20)"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      border: "1px solid black", // Add the border property here, // Optional: Add padding to make the border visible
                    }}

                  >
                    <foreignObject width="160" height="200" >
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                       
                        className={styles["menu-box"]}

                      >
                        <text onClick={() => handleMenuActions('add_mem')}>
                          <img
                            src={`${ASSET_PREFIX_URL}add-member.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} />Add Member</text>

                        {/* <text onClick={() => handleMenuActions('change_manager')}>
                          <img
                            src={`${ASSET_PREFIX_URL}change-manager.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} />
                          Change Manager
                        </text> */}
                      </div>
                    </foreignObject>
                  </g>
                )}

              </g>
              <g onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {/* <line
                x1="0"
                y1="-50"
                x2="0"
                y2="-67"
                stroke="#FF7A7A"
                strokeWidth="2"
              /> */}

                <line
                  x1="-30"
                  y1="40"
                  x2="-30"
                  y2="26"
                  stroke="#FF7A7A"
                  strokeWidth="2"
                />
                <image

                  x="-42"
                  y="35"
                  width="24"
                  height="24"
                  rx='10'
                  ry='10'
                  xlinkHref={`${ASSET_PREFIX_URL}pencil-edit-org.png`}
                  alt=""
                  onClick={handleEdit}
                  // data-tour="step-9"
                  style={{ background: 'white' }}
                />
                {editMenuOpen && (
                  <g
                    transform="translate(145, -20)"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      border: "1px solid black", // Add the border property here, // Optional: Add padding to make the border visible
                    }}

                  >
                    <foreignObject width="160" height="200" >
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        className={styles["menu-box"]}

                      >

                        {hasChildren ? (
                          <text
                            style={{ color: "#FF3B2F" }}
                            onClick={() => handleMenuActions('transfer_to')}>
                            <img src={`${ASSET_PREFIX_URL}changing-icon.png`} alt="" style={{ width: "20px", height: "20px" }} />
                            Transfer to ?
                          </text>
                        ) : (
                          <text
                            style={{ color: "#FF3B2F" }}

                            onClick={(e) => handleRemoveRole(e)}
                          >
                            <img src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
                            Remove Department
                          </text>
                        )}
                      </div>
                    </foreignObject>
                  </g>
                )}

              </g>
            </>
          )}
          <text
            fill="#001325"
            strokeWidth="1"
            x="-140"
            y="-21"
            dy="1em"
            textAnchor="start"
            fontFamily="Inter, sans-serif"
            fontWeight="400"
            onClick={handleRectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {textLettersLimit(nodeDatum.department_name, 20)} ({nodeDatum.unique_initial})
          </text>
         

         
          {nodeDatum.count > 0 && (
            <g transform="translate(50, -25)">
              <rect
                width="34"
                height="20"
                x="50"
                y="3"
                rx="4"
                ry="4"
                fill="#fff"
                strokeWidth='1.5'
                onClick={handleRectClick}
                style={{
                  boxShadow: "0px 2px 4px 0px rgba(72, 123, 253, 0.10)",
                  border: "1.5px solid #EDF2F7",
                  stroke: '#C4C9CC',
                  // Add box shadow style
                }}
              />
              <text
                fill="#001325"
                strokeWidth="0.3"
                x="60"
                y="4"
                dy="1em"
                textAnchor="start"
                fontFamily="Inter, sans-serif"
                font-size="15px"
                onClick={handleRectClick}
              >
                {nodeDatum.count}
              </text>
              {/* <foreignObject x="15" y="5" width="12" height="12">
                <div xmlns="http://www.w3.org/1999/xhtml">
                  <KeyboardArrowDownOutlinedIcon fontSize="14px" />
                </div>
              </foreignObject> */}
            </g>)}
        </g>
      )}

      {(!nodeDatum.entity_type || (nodeDatum.entity_type !== "member" && nodeDatum.entity_type !== "department" && nodeDatum.entity_type !== "assistant")) && (
        <g>
          
         
          
        
          <g >
            
          
            <image
              x="0"
              y="0"
              width="50"
              height="50"
              xlinkHref={`${ASSET_PREFIX_URL}Add action-d3.svg`}
              alt=""
              onClick={() => handleMenuActions('add_mem')}
              data-tour="step-8"
            />
            {addmenuopen && (
              <g
                transform="translate(50, 50)"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <foreignObject width="160" height="200">
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    className={styles["menu-box"]}
                  >
                    {/* <text onClick={handleAddDepartment}>
                        Add DepartmentonClick={() => handleMenuActions('add_mem')}
                      </text> */}
                    <text >
                      <img
                        src={`${ASSET_PREFIX_URL}add-member.svg`}
                        alt=""
                        style={{ width: "20px", height: "20px" }} />Add Member</text>
                    {/* <text onClick={handleAssistantMembers}>
                        Add Assistant
                      </text> */}
                  </div>
                </foreignObject>
              </g>
            )}
          </g>
          {/* ) */}
          {/* // } */}
          <text
            fill="black"
            strokeWidth="1"
            x="-140"
            y="-45"
            dy="1em"
            textAnchor="start"
            fontFamily="Inter, sans-serif"
            fontWeight="400"
            onClick={handleRectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {textLettersLimit(nodeDatum.jobTitle, 28)}
            {/* {nodeDatum.jobTitle ? (nodeDatum.jobTitle.length > 15 ? nodeDatum.jobTitle.substring(0, 15) + '...' : nodeDatum.jobTitle) : ""} */}
          </text>
          {/* {activeNode === nodeDatum.jobTitle && <ViewRole />} */}

          <text
            fill="#001325"
            strokeWidth="0.5"
            x="-80"
            y="-60"
            dy="5em"
            textAnchor="start"
            fontFamily="Inter, sans-serif"
            font-size="14px"
            onClick={handleRectClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
             {textLettersLimit(nodeDatum.fullName,22)}
            {/* {nodeDatum.fullName || ""} */}
          </text>

          <text
            fill="#001325"
            strokeWidth="0.1"
            x="-79"
            y="-33"
            dy="5em"
            textAnchor="start"
            fontFamily="Inter, sans-serif"
            fontSize="12px"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {textLettersLimit(nodeDatum.email,24)}
          
          </text>
          {/* <image
            href={nodeDatum.photo || ""}
            x="-125"
            y="-1"
            width="25"
            height="25"
            clipPath="url(#circleClip)"

          /> */}
          <foreignObject
            x="-145"
            y="-18"
            width="50"
            height="50"
            clipPath="url(#circleClip)"
          >
            <div  className={styles["image-container-d3"]} onMouseEnter={handleMouseEnter} onClick={handleRectClick}
              onMouseLeave={handleMouseLeave}>
              {/* {nodeDatum.photo ? <img
                className="rounded-image-d3"
                src={PHOTO_LINK + nodeDatum.photo}
                alt=""
              /> : ''} */}

            </div>
          </foreignObject>

         
         

        </g>
      )}
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

  const [deletePopUp, setDeletePopUp] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchOrg();


  }, [updatedData]);




 
  const fetchOrg = async () => {
    try {
      
      const response = await axios.get(BASE_URL + '/v1/org/get-hierarchy', { headers: HEADERS });
      if (response.data.meta.code == 200) {
        setHierarchy(response.data.data.hierarchy);
        setIsSetAdmin(response.data.data.is_admin);
        setIsCollaborator(response.data.data.isCollaborator);
       
        setLoading(false);
        
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }

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
     
      await axios.get(BASE_URL + "/v1/org/add-collab", {
        headers: HEADERS,
      });

    } catch (error) {
      console.error("Error fetching options data:", error);
    }
  };

  const fetchAddedData = async () => {
    try {
      
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
      <div style={containerStyles} ref={containerRef} className={styles["org-hierarchy"]}  onClick={handleToggleOfMenu}>
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
                  
                   deletePopUp, setDeletePopUp, textLettersLimit
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
            {/* {activeNode && <ViewRole activeNode={clickedData}/>} */}
            {/* {action === 'view_role' && <ViewRole activeNode={clickedData} setAction={setAction} />}
            {action === 'add_dept' && <EditDoc activeNode={clickedData} setAction={setAction} setUpdatedData={setUpdatedData} />}
            {action === 'edit_role' && <EditRole activeNode={clickedData} setAction={setAction} setUpdatedData={setUpdatedData}/>}
            {(action === 'add_mem' || action === 'add_assist') && <AddMember activeNode={clickedData} setAction={setAction} action={action} setUpdatedData={setUpdatedData}/>}
            {action === 'change_manager' && <EditManager activeNode={clickedData} hierarchy={hierarchy} setAction={setAction} setUpdatedData={setUpdatedData}/>}
            {action === 'transfer_to' && <RemoveChangeManager activeNode={clickedData} hierarchy={hierarchy} setAction={setAction} setUpdatedData={setUpdatedData}/>}
            {collabOpen && <AddCollaborate />}
            {deletePopUp && <DeleteConfirmation activeNode={clickedData} setHasChildren={setHasChildren} onclose={handleCloseDelete} setUpdatedData={setUpdatedData}/>} */}

          </>
        )}
      </div>
    </>

  );
}

export default Hierarchy;
