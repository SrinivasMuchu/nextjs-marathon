const customStyles = {
    menu: (provided) => ({
      ...provided,
      overflowY: "auto",
      overflow: "hidden", // Disable the default browser scrollbar
    }),
    menuList: (provided) => ({
      ...provided,
      "::-webkit-scrollbar": {
        width: "8px",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#888",
        borderRadius: "8px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected ? "transparent" : "white", // Set the background color
      color: state.isSelected ? "black" : "inherit", // Set the text color
    }),
  };
  
  export default customStyles;
  