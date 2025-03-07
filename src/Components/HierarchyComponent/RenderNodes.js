import React from 'react'
import styles from './Hierarchy.module.css'
import { textLettersLimit } from "@/common.helper";
import { ASSET_PREFIX_URL } from '@/config';
import NameProfile from '../CommonJsx/NameProfile';
import Image from 'next/image'

function RenderNodes({nodeDatum, activeNode, handleRectClick, handleMouseEnter,
    handleMouseLeave, strokeColor, isHovered, handleRemoveRole,
    handleMenuActions, editMenuOpen, addmenuopen, handleEdit,fillColor,strokeDepColor,hasChildren,handleAdd}) {
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
                            <Image width={20} height={20}
                              src={`${ASSET_PREFIX_URL}add-member.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />Add Member</text>
                          <text onClick={() => handleMenuActions('add_assist')}>
                            <Image width={20} height={20}
                              src={`${ASSET_PREFIX_URL}add-assistant.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />
                            Add Assistant
                          </text>
                          <text onClick={() => handleMenuActions('add_dept')}>
                            <Image width={20} height={20}
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
                          <Image width={20} height={20}
                            src={`${ASSET_PREFIX_URL}view-role.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} /> View Role</text>
                        {/* <text onClick={() => handleMenuActions('edit_role')}>
                          <Image width={20} height={20}
                            src={`${ASSET_PREFIX_URL}edit-role.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} />Edit Role</text> */}

                        <text
                          style={{ color: "#FF3B2F" }}

                          onClick={(e) => handleRemoveRole(e)}
                        >
                          <Image width={20} height={20} src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
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
                            <Image width={20} height={20}
                              src={`${ASSET_PREFIX_URL}view-role.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} /> View Role</text>
                          {/* <text onClick={() => handleMenuActions('edit_role')}>
                            <Image width={20} height={20}
                              src={`${ASSET_PREFIX_URL}edit-role.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />Edit Role</text> */}
                          <text onClick={() => handleMenuActions('change_manager')}>
                            <Image width={20} height={20}
                              src={`${ASSET_PREFIX_URL}change-manager.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />
                            Change Manager
                          </text>
                          {hasChildren ? (
                            <text
                              style={{ color: "#FF3B2F" }}
                              onClick={() => handleMenuActions('transfer_to')}>
                              <Image width={20} height={20} src={`${ASSET_PREFIX_URL}changing-icon.png`} alt="" style={{ width: "20px", height: "20px" }} />
                              Transfer to ?
                            </text>
                          ) : (
                            <text
                              style={{ color: "#FF3B2F" }}

                              onClick={(e) => handleRemoveRole(e)}
                            >
                              <Image width={20} height={20} src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
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
                          <Image width={20} height={20}
                            src={`${ASSET_PREFIX_URL}view-role.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} /> View Role</text>
                        {/* <text onClick={() => handleMenuActions('edit_role')}>
                          <Image width={20} height={20}
                            src={`${ASSET_PREFIX_URL}edit-role.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} />Edit Role</text> */}

                        <text
                          style={{ color: "#FF3B2F" }}

                          onClick={(e) => handleRemoveRole(e)}
                        >
                          <Image width={20} height={20} src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
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
                              <Image width={20} height={20}
                                src={`${ASSET_PREFIX_URL}view-role.svg`}
                                alt=""
                                style={{ width: "20px", height: "20px" }} /> View Role</text>
                            {/* <text onClick={() => handleMenuActions('edit_role')}>
                              <Image width={20} height={20}
                                src={`${ASSET_PREFIX_URL}edit-role.svg`}
                                alt=""
                                style={{ width: "20px", height: "20px" }} />Edit Role</text> */}
                            {/* <text onClick={() => handleMenuActions('change_manager')}>
                              <Image
                                src={`${ASSET_PREFIX_URL}change-manager.svg`}
                                alt=""
                                style={{ width: "20px", height: "20px" }} />
                              Change Manager
                            </text> */}
                            {hasChildren ? (
                              <text
                                style={{ color: "#FF3B2F" }}
                                onClick={() => handleMenuActions('transfer_to')}>
                                <Image width={20} height={20} src={`${ASSET_PREFIX_URL}changing-icon.png`} alt="" style={{ width: "20px", height: "20px" }} />
                                Transfer to ?
                              </text>
                            ) : (
                              <text
                                style={{ color: "#FF3B2F" }}

                                onClick={(e) => handleRemoveRole(e)}
                              >
                                <Image width={20} height={20} src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
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
                            <Image width={20} height={20}
                              src={`${ASSET_PREFIX_URL}view-role.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} /> View Role</text>
                          {/* <text onClick={() => handleMenuActions('edit_role')}>
                            <Image width={20} height={20}
                              src={`${ASSET_PREFIX_URL}edit-role.svg`}
                              alt=""
                              style={{ width: "20px", height: "20px" }} />Edit Role</text> */}

                          <text
                            style={{ color: "#FF3B2F" }}

                            onClick={(e) => handleRemoveRole(e)}
                          >
                            <Image width={20} height={20} src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
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

              <NameProfile userName={nodeDatum.fullName} width='50px' memberPhoto={nodeDatum.photo} fontSize='24px' fontweight='500' />




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
                          <Image width={20} height={20}
                            src={`${ASSET_PREFIX_URL}add-member.svg`}
                            alt=""
                            style={{ width: "20px", height: "20px" }} />Add Member</text>

                        {/* <text onClick={() => handleMenuActions('change_manager')}>
                          <Image
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
                            <Image width={20} height={20} src={`${ASSET_PREFIX_URL}changing-icon.png`} alt="" style={{ width: "20px", height: "20px" }} />
                            Transfer to ?
                          </text>
                        ) : (
                          <text
                            style={{ color: "#FF3B2F" }}

                            onClick={(e) => handleRemoveRole(e)}
                          >
                            <Image width={20} height={20} src={`${ASSET_PREFIX_URL}menu-delete-icon.svg`} alt="" style={{ width: "20px", height: "20px" }} />
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
                      <Image width={20} height={20}
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
              {/* {nodeDatum.photo ? <Image
                className="rounded-image-d3"
                src={PHOTO_LINK + nodeDatum.photo}
                alt=""
              /> : ''} */}

            </div>
          </foreignObject>

         
         

        </g>
      )}
    </>
  )
}

export default RenderNodes