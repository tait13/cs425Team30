<?php

    
    namespace Google\Cloud\Samples\Vision;
    namespace Google\Cloud\Samples\Auth;
    use Google\Cloud\Vision\V1\ImageAnnotatorClient;
    
    require __DIR__ . '/vendor/autoload.php';
    
    try{
        error_reporting(E_ALL);
        $log = fopen("php.log", "a") or die("Unable to open file!");
        
        $text = "Begin Code " . date("D M d, Y G:i") . "\n";
        fwrite($log, $text);
        
        $path = 'https://cs425.alextait.net/serial1.png';
        
        // $imageData = base64_encode(file_get_contents($path));

        $im = imagecreatefromstring(file_get_contents($path));

        if( $im !== false)
        {
            header('Content-Type: image/png');
            // imagepng($im);
        }


        // Format the image SRC:  data:{mime};base64,{data};
        // $src = 'data: '.mime_content_type($path).';base64,'.$imageData;
        
        // Echo out a sample image
        // echo '<img src="' . $src . '" height = 250>';
        
        // printf("test\n");
        
        $config = ['credentials' => 'cs425-9bcc7a946012.json',    
                ];
        
        
        $imageAnnotator = new ImageAnnotatorClient($config);
        
        #annotate the image
        // printf("test\n");
        $response = $imageAnnotator->textDetection($path);
        // printf("test\n");
        $texts = $response->getTextAnnotations();
        // printf("test\n");
        // 
        // printf('%d texts found:' . PHP_EOL, count($texts));
        
        // $jsonArray = [];
        $yellow = imagecolorallocate($im, 255, 255, 0);
        $output = '';
        foreach($texts as $text)
        {
            $output = $output . ($text->getDescription() . '<br>');
            
            // $properties = $text->getProperties();
            
            
            
            //$output = $output . ($text->getProperties() . '<br>');   
            // $textArray->text = $text->getDescription();
            
            # get bounds
            $vertices = $text->getBoundingPoly()->getVertices();
            $bounds = [];
            $xverts = [];
            $yverts = [];
            foreach ($vertices as $vertex)
            {
                $bounds[] = sprintf('(%d,%d)', $vertex->getX(), $vertex->getY());
                $xverts[] = $vertex->getX();
                $yverts[] = $vertex->getY();
            }
            
            $output = $output . ('Bounds: ' . join(', ', $bounds). '<br>');
            imagerectangle($im,$xverts[0],$yverts[0],$xverts[2],$yverts[2], $yellow);
        }
        
        imagepng($im);
        
        echo(json_encode($output));
        $imageAnnotator->close();
        
        $text = "End Code " . date("D M d, Y G:i") . "\n";
        fwrite($log, $text);

    } catch (Exception $e) {
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
    
?>
