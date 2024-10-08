<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

$googleSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpjX3woM8-mPVKyqlRqUIozWyEWo4c8-37BE3bPVw6MBDQRoFo4xg4Ndo5xmUzlOCiF-ughPAuyxZq/pub?gid=0&single=true&output=csv";

$rowCount = 0;
$features = array();
$error = FALSE;
$output = array();

// attempt to set the socket timeout, if it fails then echo an error
if ( ! ini_set('default_socket_timeout', 15))
{
  $output = array('error' => 'Unable to Change PHP Socket Timeout');
  $error = TRUE;
} // end if, set socket timeout

// if the opening the CSV file handler does not fail
if ( !$error && (($handle = fopen($googleSpreadsheetUrl, "r")) !== FALSE) )
{
  // while CSV has data, read up to 10000 rows
  while (($csvRow = fgetcsv($handle, 10000, ",")) !== FALSE)
  {
    $rowCount++;

    if ($rowCount == 1) { continue; } // skip the first/header row of the CSV

    $features[] = array(
      'type'     => 'Feature',
      'geometry' => array(
        'type'   => 'Point',
        'coordinates' => array(
          (float) $csvRow[3], // longitude, casted to type float
          (float) $csvRow[2]  // latitude, casted to type float
        )
      ),
    'properties' => array(
    'nama' => $csvRow[0],
    'tanggal' => $csvRow[1],
    'link' => $csvRow[4],
      )
    );
  } // end while, loop through CSV data

  fclose($handle); // close the CSV file handler

  $output = array(
    'type' => 'FeatureCollection',
    'features' => $features
  );
}  // end if , read file handler opened

// else, file didn't open for reading
else
{
  $output = array('error' => 'Problem Reading Google CSV');
}  // end else, file open fail

// convert the PHP output array to JSON "pretty" format
$jsonOutput = json_encode($output, JSON_PRETTY_PRINT);

// render JSON and no cache headers
header('Content-type: application/json; charset=utf-8');
//header('Cache-Control: no-cache, must-revalidate');
//header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Access-Control-Allow-Origin: *');

print $jsonOutput;
?>