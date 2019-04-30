<?php
    
    //Start Connection to mySQL server
    $connection = new mysqli("localhost", "alextait", "1phO3a17gX", "alextait_Cs425");
  
    //Check if successful
    if(!$connection)
    {
        die("Connection failed:" . mysqli_connect_error());
    }

    //View All Assets
    $result = $connection->query('SELECT * FROM Assets WHERE creationTime="' . $_POST["creationTime"] . '"');

    //Store Output for JSON
    $output = '{ ';
    $output .= '"rowCount": ' . $result->num_rows . ',';
    
    //
    if($result->num_rows > 0)
    {
        
        $fields = $result->fetch_fields();
        
        //Retrieve each row
        while($row = $result->fetch_assoc())
        {
            
            $output .= '"creationTime": "' . $row["creationTime"] . '",';
            $output .= ' "originalImageLoc": "' . $row["originalImageLoc"] . '",';
            $output .= ' "boxedImageLoc": "' . $row["boxedImageLoc"] . '",';
            $output .= ' "Name": "' . $row["Name"] . '",';
            $output .= ' "Location": "' . $row["Location"] . '",';
            $output .= ' "Type": "' . $row["Type"] . '",';
            $output .= ' "Manufacturer": "' . $row["Manufacturer"] . '",';
            $output .= ' "assetJSON": ' . json_encode($row["AssetJSON"]) . ',';
            
            // echo '<br>';
        }
        $output = rtrim($output, ',');
    }
    else 
    {
        $output = rtrim($output, ',');
    }
    
    $output .= '}';
    echo $output;
    
    
  
?>
