<?php /** @noinspection ALL */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("add_new_tag.php - may be options call - JSON request not sent - exiting");
	exit();
}
error_log("add_new_tag.php - Here is the JSON received: ");
error_log($request);
$newTag = json_decode($request);

error_log("add_new_tag.php - Received data: tagId=" . $newTag->tagId . ", tagCd=" . $newTag->tagCd . ", tagNm=" . $newTag->tagNm);

// now insert or update this tag
$filename = 'db/kb.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3($filename);
	try {
		$statement = $db->prepare('update kb_tag set tag_cd = :tagCd, tag_nm = :tagNm where id = :tagId');
		$statement->bindValue(':tagNm', $newTag->tagNm);
		$statement->bindValue(':tagCd', $newTag->tagCd);
		$statement->bindValue(':tagId', $newTag->tagId);
		$statement->execute();
		$statement->close();

		if ($db->changes() < 1) {
			$statement = $db->prepare("insert into kb_tag (tag_cd, tag_nm) values (:tagCd,:tagNm)");
			$statement->bindValue(':tagCd', $newTag->tagCd);
			$statement->bindValue(':tagNm', $newTag->tagNm);
			$statement->execute();
			$statement->close();
			error_log("add_new_tag.php - Inserted new tag...");
            // now get the newly generated id
            $results = $db->query('SELECT last_insert_rowid() as id');
            $id = -1;
            while ($row = $results->fetchArray()) {
                $id = $row["id"];
                break;
            }
            $newTag->tagId = $id;
		} else {
			error_log("add_new_tag.php - Updated existing tag...");
		}
	} catch (Exception $e) {
		error_log("add_new_tag.php - Error inserting or updating tag...  Error message: " . $e->getMessage());
	}
    $db->close();
    print_r(json_encode($newTag));
} else {
	error_log("add_new_tag.php - No database file " . $filename);
	print_r(json_encode("error|There is no database named " . $filename));
}
?>