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

        $im = imagecreatefromstring(file_get_contents($path));

        // if( $im !== false)
        // {
        //     // header('Content-Type: image/png');
        //     // imagepng($im);
        // }


        $config = ['credentials' => 'cs425-9bcc7a946012.json',    
                ];
        
        
        $imageAnnotator = new ImageAnnotatorClient($config);
        
        #annotate the image
        $response = $imageAnnotator->textDetection($path);

        $texts = $response->getTextAnnotations();

        // printf('%d texts found:' . PHP_EOL, count($texts));
        
        $yellow = imagecolorallocate($im, 255, 255, 0);
        imagesetthickness ( $im, 5 );
        $output = '';
        foreach($texts as $text)
        {
            $output = $output . ($text->getDescription() . '<br>');
            
            
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
        
        //Convert image into byte stream to export to html
        ob_start();
        imagepng($im);
        $imStream = ob_get_clean();
        $src = 'data:image/png;base64,'.base64_encode($imStream);
        echo '<img src="' .$src .'" height=250/>';
        echo '<br>';
        
        //echo output as json object
        echo(json_encode($output));
        $imageAnnotator->close();
        
        $text = "End Code " . date("D M d, Y G:i") . "\n";
        fwrite($log, $text);

    } catch (Exception $e) {
        echo 'Caught exception: ',  $e->getMessage(), "\n";
    }
    
?>
