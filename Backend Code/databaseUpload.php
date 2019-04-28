<?php

    //Start Connection to mySQL server
    $connection = new mysqli("localhost", "alextait", "1phO3a17gX", "alextait_Cs425");
  
    //Check if successful
    if(!$connection)
    {
        die("Connection failed:" . mysqli_connect_error());
    }

    list($width, $height, $type, $attr) = getimagesize($_POST["originalImageLoc"]); 

    //Insert POST values into database
    $sql = "INSERT INTO Assets (creationTime, originalImageLoc, boxedImageLoc, Name, Type, Manufacturer, Location, imageWidth, imageHeight, AssetJSON) VALUES
        ('".date("Y-m-d H:i:s")."', '"
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
        print "New Record Created";
    }
    else
    {
        print "Error: " . $sql . "<br>" . $connection->error;
    }

?>
