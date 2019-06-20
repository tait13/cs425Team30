<?php

    //Start Connection to mySQL server
    $connection = new mysqli("localhost", "alextait", "", "alextait_Cs425");
  
    //Check if successful
    if(!$connection)
    {
        die("Connection failed:" . mysqli_connect_error());
    }

    list($width, $height, $type, $attr) = getimagesize($_POST["originalImageLoc"]); 

    $creationTime = date("Y-m-d H:i:s");
    //Insert POST values into database
    $sql = "INSERT INTO Assets (creationTime, originalImageLoc, boxedImageLoc, Name, Type, Manufacturer, Location, imageWidth, imageHeight, AssetJSON) VALUES
        ('".$creationTime."', '"
        .$_POST["originalImageLoc"]."', '"
        .$_POST["boxedImageLoc"]."', '"
        .$_POST["name"]."', '"
        .$_POST["type"]."', '"
        .$_POST["manufacturer"]."', '"
        .$_POST["location"]."', '"
        .$width."', '"
        .$height."', '"
        .$_POST["json"]."');";
        
    //Check if successful    
    if($connection->query($sql) === TRUE)
    {

        echo('{"Status":"Success","Message":"Asset Uploaded To Database","Time":"' . $creationTime . '"}');
    }
    else
    {
        // print "Error: " . $sql . "<br>" . $connection->error;
        echo('{"Status":"Success","Message":"Failed to upload to database. '. $sql . '","Time":"' . $creationTime . '"}');
    }

?>
