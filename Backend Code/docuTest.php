<?php

    
    namespace Google\Cloud\Samples\Vision;
    namespace Google\Cloud\Samples\Auth;
    use Google\Cloud\Vision\V1\ImageAnnotatorClient;
    
    require __DIR__ . '/vendor/autoload.php';
    
    try{
        $target_dir = "uploads/";
    
        $baseImPath= basename($_FILES["photo"]["name"]) . date("Y-m-d-H:i:s");
        $target_file = $target_dir . $baseImPath . '.png';
        
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
        
        error_reporting(E_ALL);
        $log = fopen("php.log", "w") or die("Unable to open file!");
        
        $text = "Begin Code " . date("D M d, Y G:i") . "\n";
        fwrite($log, $text);
        
        $path = 'https://cs425.alextait.net/';

        // $im = imagecreatefromstring(file_get_contents($path));

        

        $im = imagecreatefromstring(file_get_contents($_FILES["photo"]["tmp_name"]));
        
        if($_FILES["photo"]["type"] == "image/jpeg")
        {
            $exif = exif_read_data($_FILES['photo']['tmp_name']);
            if($exif !== false)
            {
                if (!empty($exif['Orientation'])) {
                    switch ($exif['Orientation']) {
                        case 3:
                        $im = imagerotate($im, 180, 0);
                        break;
                        case 6:
                        $im = imagerotate($im, -90, 0);
                        break;
                        case 8:
                        $im = imagerotate($im, 90, 0);
                        break;
                        default:
                        $im = $im;
                    } 
                }
            }
        }
        imagepng($im, $target_file);


        // $im = imagecreatefromstring(file_get_contents($target_file));
        // if( $im !== false)
        // {
        //     // header('Content-Type: image/png');
        //     // imagepng($im);
        // }
        header('Content-Type: application/json');

        $config = ['credentials' => 'cs425-9bcc7a946012.json',    
                ];
        
        
        $imageAnnotator = new ImageAnnotatorClient($config);
        
        #annotate the image
        $response = $imageAnnotator->documentTextDetection($path . $target_file);
        
        $annotation = $response->getFullTextAnnotation();
        
        if($annotation === null)
        {
            // print_r($response);
            //print_r($target_file);
            //print_r('annotation is null');
        }

        // printf('%d texts found:' . PHP_EOL, count($texts));
        
        
        $yellow = imagecolorallocate($im, 255, 255, 0);
        imagesetthickness ( $im, 10 );
        $output = '{ "Strings": [';
        
        
        foreach($annotation->getPages() as $page)
        {
            foreach($page->getBlocks() as $block)
            {
                foreach($block->getParagraphs() as $paragraph)
                {
                    foreach($paragraph->getWords() as $word)
                    {
                        $wordText = '';
                        foreach($word->getSymbols() as $symbol)
                        {
                            if($symbol->getText() == '"')
                            {
                                $wordText .= "\\" . $symbol->getText();
                            }
                            else
                            {
                                $wordText .= $symbol->getText();
                            }
                                
                        }
                        //$wordText = str_replace('"', $wordText, '\"');
                        $output = $output . '{"Word": "' . ($wordText) . '",';
                        $output = str_replace("\n", " ", $output);
                        
                        # get bounds
                        $vertices = $word->getBoundingBox()->getVertices();
                        $bounds = [];
                        $xverts = [];
                        $yverts = [];
                        foreach ($vertices as $vertex)
                        {
                            $bounds[] = sprintf('(%d,%d)', $vertex->getX(), $vertex->getY());
                            $xverts[] = $vertex->getX();
                            $yverts[] = $vertex->getY();
                        }
                        
                        $output = $output . ('"Bounds": "' . join(', ', $bounds) . '"},');
                        imagerectangle($im,$xverts[0],$yverts[0],$xverts[2],$yverts[2], $yellow);
                    }
                }
            }
        }
        
        
        $output = rtrim($output, ',');
        $boxedPath = $target_dir . $baseImPath . 'Boxed.png';
        imagepng($im, $boxedPath);
        
        //echo output as json object
        $output = $output . "],";
        
        $output = $output . '"imageURL": "https://cs425.alextait.net/' . $boxedPath . '"}';
       
        $imageAnnotator->close();
        fwrite($log, $output);
        $text = "End Code " . date("D M d, Y G:i") . "\n";
        fwrite($log, $text);
        echo($output);

    } catch (Exception $e) {
        echo 'Caught exception: ',  $e->getMessage(), "\n";
        fwrite($log, 'Caught exception: ');
    }
    
?>
