<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch total reports count
    $get_total_reports_query = "SELECT COUNT(*) AS total_reports FROM users_reports";
    $get_total_reports_result = mysqli_query($con, $get_total_reports_query);

    if ($get_total_reports_result) {
        $totalReportsData = mysqli_fetch_assoc($get_total_reports_result);
        $totalReports = $totalReportsData['total_reports'];

        // Fetch report counts over a period (e.g., last 7 days)
        $get_report_counts_query = "SELECT DATE(report_time) AS report_date, COUNT(*) AS count
                                    FROM users_reports
                                    WHERE report_time >= NOW() - INTERVAL 7 DAY
                                    GROUP BY report_date";
        $get_report_counts_result = mysqli_query($con, $get_report_counts_query);

        $reportCounts = [];
        $labels = [];
        $data = [];

        while ($row = mysqli_fetch_assoc($get_report_counts_result)) {
            $labels[] = $row['report_date'];
            $data[] = $row['count'];
        }

        $reportCounts['labels'] = $labels;
        $reportCounts['data'] = $data;

        $data['totalReports'] = $totalReports;
        $data['reportCounts'] = $reportCounts;
        $data['status'] = 'success';
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Error fetching total reports count.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>