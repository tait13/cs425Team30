<?php
    
    //Start Connection to mySQL server
    $connection = new mysqli("localhost", "alextait", "", "alextait_Cs425");
  
    //Check if successful
    if(!$connection)
    {
        die("Connection failed:" . mysqli_connect_error());
    }
    
    //View All Assets
    $result = $connection->query("SELECT * FROM Assets");
    
    //Store Output for JSON
    $output = '{ ';
    $output .= '"rowCount": ' . $result->num_rows . ',';
    
    //
    if($result->num_rows > 0)
    {
        
        $fields = $result->fetch_fields();
        
        // echo '<br>';
        // echo $result->num_rows;
        // echo '<br>';
        
        $output .= '"rows": [';
        
        //Retrieve each row
        while($row = $result->fetch_assoc())
        {
        
            // echo "creationTime: " . $row["creationTime"];
            // echo " originalImageLoc: " . $row["originalImageLoc"];
            // echo "boxedImageLoc: " . $row["boxedImageLoc"];
            // echo " name: " . $row["name"];
            
            $output .= '{ "creationTime": "' . $row["creationTime"] . '",';
            $output .= ' "originalImageLoc": "' . $row["originalImageLoc"] . '",';
            $output .= ' "boxedImageLoc": "' . $row["boxedImageLoc"] . '",';
            $output .= ' "Location": "' . $row["Location"] . '",';
            $output .= ' "Type": "' . $row["Type"] . '",';
            $output .= ' "Manufacturer": "' . $row["Manufacturer"] . '",';
            $output .= ' "AssetJSON": ' . json_encode($row["AssetJSON"]) . ',';
            $output .= ' "Name": "' . $row["Name"] . '"},';
            
            // echo '<br>';
        }
        $output = rtrim($output, ',');
        $output .= ']';
    }
    else 
    {
        $output = rtrim($output, ',');
    }
    
    $output .= '}';
    echo $output;
    
    
  
?>
