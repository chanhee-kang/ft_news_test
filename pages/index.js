import CountryList from '../components/CountryList';

import { Button, Box } from '@material-ui/core';
import { FiMenu } from "react-icons/fi"
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';


export default function Home() {
  const [showTextField, setShowTextField] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleTextField = () => {
    setShowTextField(!showTextField);
  };

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([textValue], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "FinancialTimes요약.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleTextAreaChange = (event) => {
    setTextValue(event.target.value);
  };
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleDrawerItemClick = () => {
    // Handle the action when a menu item is clicked
    // For example, you can perform navigation or other actions hereF3F3F3
    toggleDrawer();
  };

  return (  
    <>
    <Box style={{ backgroundColor : "#FFFFFF" }}>
  
      <header style={{backgroundColor: "#000033", height : "120px"}}>
      <Box className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="#" className="header-logo" style={{ color: 'white' }}>Financial Times</a>
            <Button variant="contained" onClick={toggleDrawer} style={{ backgroundColor: 'transparent', border: 'none' }}>
            <FiMenu color="#ffffff" size={50} />
          </Button>
        </Box>

      </header>
  <Box style={{ backgroundColor : "#FFFFFF", margin :"30px" }}>
    
    <Box justifyContent='center' alignItems='center'>
      <CountryList />
    </Box>   
  </Box>  
  </Box>
  <Box style={{height:"50px", backgroundColor :"#000033"}}/>   
  </>
  );
}


{/* <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer} PaperProps={{ style: { width: 350 } }}> */}
        // <List>
        //   {/* Add your menu items here */}
        //   <ListItem button onClick={handleDrawerItemClick}>
        //     <ListItemText primary="Menu Item 1" />
        //   </ListItem>
        //   <ListItem button onClick={handleDrawerItemClick}>
        //     <ListItemText primary="Menu Item 2" />
        //   </ListItem>
        //   <ListItem button onClick={handleDrawerItemClick}>
        //     <ListItemText primary="Menu Item 3" />
        //   </ListItem>
        // </List>
      // </Drawer>