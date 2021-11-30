<?php /** @noinspection ALL */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$db = null;
$filename = 'db/kb.sqlite';
if (file_exists($filename)) {
    $db = new SQLite3($filename);
    $results = $db->query('select id, tag_cd, tag_nm from kb_tag order by LOWER(tag_nm)');
    $arrayName = array();
    while ($row = $results->fetchArray()) {
        $tag = new stdClass;
        $tag->tagId = $row['id'];
        $tag->tagNm = $row['tag_nm'];
        $tag->tagCd = $row['tag_cd'];
        array_push($arrayName, $tag);
    }
    $db->close();
    print_r(json_encode($arrayName));
}

?>
