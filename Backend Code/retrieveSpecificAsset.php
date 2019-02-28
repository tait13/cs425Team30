<?php
    
    //Start Connection to mySQL server
    $connection = new mysqli("localhost", "alextait", "1phO3a17gX", "alextait_Cs425");
  
    //Check if successful
    if(!$connection)
    {
        die("Connection failed:" . mysqli_connect_error());
    }
    
    //$_POST["creationTime"]
    //View All Assets
    
    // $result = $connection->query("SELECT * FROM Assets WHERE creationTime=" . '"2019-02-27 18:04:13"');
    $result = $connection->query('SELECT * FROM Assets WHERE creationTime="' . $_POST["creationTime"] . '"');

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
        
        //Retrieve each row
        while($row = $result->fetch_assoc())
        {
        
            // echo "creationTime: " . $row["creationTime"];
            // echo " originalImageLoc: " . $row["originalImageLoc"];
            // echo "boxedImageLoc: " . $row["boxedImageLoc"];
            // echo " name: " . $row["name"];
            
            $output .= '"creationTime": "' . $row["creationTime"] . '",';
            $output .= ' "originalImageLoc": "' . $row["originalImageLoc"] . '",';
            $output .= ' "boxedImageLoc": "' . $row["boxedImageLoc"] . '",';
            $output .= ' "name": "' . $row["name"] . '",';
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
