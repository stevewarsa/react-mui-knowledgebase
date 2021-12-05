<?php /** @noinspection ALL */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$db = null;
$filename = 'db/kb.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3($filename);
	$tagQuery = 'SELECT tag_id from kb_tag_kb_entry where kb_id = :kb_id order by tag_id';
	$results = $db->query('SELECT id, title, description, markdown, appl_create_dt from kb_entry order by appl_create_dt desc');

	$kbEntries = array();
	while ($row = $results->fetchArray()) {
		$kbEntry = new stdClass;
		$kbEntry->id = $row['id'];
		$kbEntry->title = $row['title'];
		$kbEntry->desc = $row['description'];
		$kbEntry->markdown = $row['markdown'] == true || $row['markdown'] == 1;
		$statement = $db->prepare($tagQuery);
		$statement->bindValue(':kb_id', $kbEntry->id);
		$tagResults = $statement->execute();
		$tags = array();
		while ($tagRow = $tagResults->fetchArray()) {
			$tag = new stdClass;
			$tag->tagId = $tagRow['tag_id'];
			$tag->tagNm = null;
			$tag->tagCd = null;
			array_push($tags, $tag);
		}
		$statement->close();
		$kbEntry->tags = $tags;
		array_push($kbEntries, $kbEntry);
	}

	$db->close();

	print_r(json_encode($kbEntries));
} else {
	error_log("get_kb_entries.php - No database file " . $filename);
	print_r(json_encode("error|There is no database file named " . $filename));
}
?>

