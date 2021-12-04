<?php /** @noinspection ALL */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept');
header('Content-Type: application/json; charset=utf8; Accept: application/json');

$request = file_get_contents('php://input');
if (empty($request)) {
	error_log("add_kb_entry.php - may be options call - JSON request not sent - exiting");
	exit();
}
error_log("add_kb_entry.php - Here is the JSON received: ");
error_log($request);
$kbEntry = json_decode($request);

error_log("add_kb_entry.php - Received data: id=" . $kbEntry->id . ", title=" . $kbEntry->title . ", desc=" . $kbEntry->desc . ", tagCount=" . sizeof($kbEntry->tags));

// now insert or update this kbEntry
$db = null;
$filename = 'db/kb.sqlite';
if (file_exists($filename)) {
	$db = new SQLite3($filename);
	try {
		$statement = $db->prepare('update kb_entry set title = :title, description = :description, markdown = :markdown where id = :id');
		$statement->bindValue(':title', $kbEntry->title);
		$statement->bindValue(':description', $kbEntry->desc);
        $statement->bindValue(':markdown', $kbEntry->markdown);
		$statement->bindValue(':id', $kbEntry->id);
		$statement->execute();
		$statement->close();

		if ($db->changes() < 1) {
			$statement = $db->prepare("insert into kb_entry (title, description, markdown) values (:title,:description,:markdown)");
			$statement->bindValue(':title', $kbEntry->title);
            $statement->bindValue(':description', $kbEntry->desc);
            $statement->bindValue(':markdown', $kbEntry->markdown);
			$statement->execute();
			$statement->close();
			error_log("add_kb_entry.php - Inserted new kbEntry...");
            // now get the newly generated id
            $results = $db->query('SELECT last_insert_rowid() as id');
            $id = -1;
            while ($row = $results->fetchArray()) {
                $id = $row["id"];
                break;
            }
            $kbEntry->id = $id;
		} else {
			error_log("add_kb_entry.php - Updated kbEntry...");
		}
        // now deal with the tags - first clear the table of any tag associations
        $statement = $db->prepare('delete from kb_tag_kb_entry where kb_id = :kb_id');
        $statement->bindValue(':kb_id', $kbEntry->id);
        $statement->execute();
        $statement->close();
        if (sizeof($kbEntry->tags) > 0) {
            // First, see if there are any brand new tags added - if so, we need to insert them
            $tagQuery = 'SELECT count(1) as ct from kb_tag where tag_cd = :tag_cd';
            $tagInsert = 'INSERT into kb_tag (id, tag_cd, tag_nm) VALUES (:id, :tag_cd, :tag_nm)';
            foreach ($kbEntry->tags as $tg) {
                $statement = $db->prepare($tagQuery);
                $statement->bindValue(':tag_cd', $tg->tagCd);
                $results = $statement->execute();
                while ($row = $results->fetchArray()) {
                    if (intval($row['ct']) <= 0) {
                        // tag does not exist, so add it
                        $tagInsertStatement = $db->prepare($tagInsert);
                        $tagInsertStatement->bindValue(':id', $tg->tagId);
                        $tagInsertStatement->bindValue(':tag_cd', $tg->tagCd);
                        $tagInsertStatement->bindValue(':tag_nm', $tg->tagNm);
                        $tagInsertStatement->execute();
                        $tagInsertStatement->close();
                    }
                    break;
                }
                $statement->close();

                // Now,the new tag is inserted (if needed).  So, create the association record
                $kbTagInsert = 'INSERT into kb_tag_kb_entry (kb_id, tag_id) VALUES (:kb_id, :tag_id)';
                $kbTagInsertStatement = $db->prepare($kbTagInsert);
                $kbTagInsertStatement->bindValue(':kb_id', $kbEntry->id);
                $kbTagInsertStatement->bindValue(':tag_id', $tg->tagId);
                $kbTagInsertStatement->execute();
                $kbTagInsertStatement->close();
            }
        }
		$db->close();
		print_r(json_encode($kbEntry));
	} catch (Exception $e) {
		error_log("add_kb_entry.php - Error inserting or updating kbEntry...  Error message: " . $e->getMessage());
		$db->close();
		print_r(json_encode($kbEntry));
	}
} else {
	error_log("add_kb_entry.php - No database file " . $filename);
	print_r(json_encode("error|There is no database named " . $filename));
}
?>