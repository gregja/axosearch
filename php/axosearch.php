<?php
    $search_path = "/home/gregja/Documents/axoloti_works"; // personalize the path
    if (isset($_GET['searchdata'])) {
        $searchdata = trim($_GET['searchdata']);
    } else {
        $searchdata = '';
    }
    if (isset($_GET['searchtype'])) {
         $searchtype = trim($_GET['searchtype']);
    } else {
        $searchtype = 'type';
    }

    $sel_options = [];
    $sel_options []= ["code"=>"all", "desc"=> "All code"];
    $sel_options []= ["code"=>"type", "desc"=> "Type attribute only"];

    $tmp_search = '';
    foreach ($sel_options as $sel_option) {
        $selected = '';
        if ($sel_option['code'] == $searchtype) {
            $selected = 'selected';
        }
        $tmp_search .= '<option value="'.$sel_option['code'].'" '.
                $selected.'>'.$sel_option['desc'].'</option>';

    }

?><!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Axoloti patch searching</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div><h3>Axoloti patch searching</h3>
            <?php

            echo <<<FORM
        <form>
            <p><label>Search criteria : <input name="searchdata" type="search"
                required placeholder="component name"
                value="$searchdata"></label></p>
            <p><label>Searching on :
                <select name="searchtype">
                   $tmp_search
                </select>
            </label></p>
            <p><input type="submit" value="Submit"></p>
        </form>
FORM;
            if ($searchdata != '') {
                if ($searchtype == 'type') {
                    $searchdata = 'type="'.$searchdata ;
                }

                $dir = new RecursiveDirectoryIterator($search_path, RecursiveDirectoryIterator::SKIP_DOTS);
                $files = new RecursiveIteratorIterator($dir, RecursiveIteratorIterator::SELF_FIRST);

                $patchs = [];

                foreach ($files as $entry) {
                    $pathname = $entry->getPathname();
                    $extension = $entry->getExtension();
                    if ($entry->getType() == 'file') {
                        if ($extension == 'axp' || $extension == 'axs') {
                            $temp = file_get_contents($pathname);
                            $look = stristr($temp, $searchdata);
                            if ($look != false) {
                                $patchs []= $pathname ;
                            }
                        }
                    }
                }

                echo "<ul>";
                foreach ($patchs as $patch) {
                    echo "<li>$patch</li>";
                }
                echo "</ul>";
            }
            ?>
        </div>
    </body>
</html>
