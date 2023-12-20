$(document).ready(function () {
    updateRegisteredUser(); 
    setInterval(updateRegisteredUser, 3000);

    updateActiveUser(); 
    setInterval(updateActiveUser, 3000);

    updateReportData(); 
    setInterval(updateReportData, 3000);

    updateTotalPosts(); 
    setInterval(updateTotalPosts, 3000);

    updateTotalLikes(); 
    setInterval(updateTotalLikes, 3000);

    updateTotalSharedPosts(); 
    setInterval(updateTotalSharedPosts, 3000);

    updateTopUserTopics(); 
    setInterval(updateTopUserTopics, 3000);
});

let registeredChart;
let activeChart;
let reportChart;
let postChart;
let likesChart;
let sharedPostsChart;

// Total Registered User
function updateRegisteredUser() {
    $.ajax({
        url: '../actions/admin-side/get-total-registered-users.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            updateRegisteredUsers(response.registeredUsers);
            updateRegisteredUsersGraph(response.registeredCounts);
        },
        error: function () {
            console.log('Error fetching user data');
        }
    });

    function updateRegisteredUsers(count) {
        $('#registeredUsers').text(count);
    }

    function updateRegisteredUsersGraph(registeredCounts) {
        const registeredCanvas = document.getElementById("registeredGraph");
        
        if (registeredChart) {
            registeredChart.destroy();
        }
    
        registeredChart = new Chart(registeredCanvas, {
            type: 'line',
            data: {
                labels: registeredCounts.labels,
                datasets: [{
                    data: registeredCounts.data,
                    borderColor: '#ff0f7b',
                    backgroundColor: '#ff0f7b',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Total Active User
function updateActiveUser() {
    $.ajax({
        url: '../actions/admin-side/get-total-active-users.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            updateActiveUsers(response.activeUsers);
            updateActiveUsersGraph(response.activeCounts, activeChart, 'activeGraph', 'Active User Count');
        },
        error: function () {
            console.log('Error fetching user data');
        }
    });

    function updateActiveUsers(count) {
        $('#activeUsers').text(count);
    }
    
    function updateActiveUsersGraph(activeCounts) {
        const activeCanvas = document.getElementById("activeGraph");
        
        if (activeChart) {
            activeChart.destroy();
        }
    
        activeChart = new Chart(activeCanvas, {
            type: 'line',
            data: {
                labels: activeCounts.labels,
                datasets: [{
                    data: activeCounts.data,
                    borderColor: '#ff0f7b',
                    backgroundColor: '#ff0f7b',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Total Reports
function updateReportData() {
    $.ajax({
        url: '../actions/admin-side/get-total-reports.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            updateTotalReports(response.totalReports);
            updateTotalReportsGraph(response.reportCounts);
        },
        error: function () {
            console.log('Error fetching report data');
        }
    });

    function updateTotalReports(count) {
        $('#totalReport').text(count);
    }
    
    function updateTotalReportsGraph(reportsCounts) {
        const reportCanvas = document.getElementById("reportGraph");
    
        if (reportChart) {
            reportChart.destroy();
        }
    
        reportChart = new Chart(reportCanvas, {
            type: 'line',
            data: {
                labels: reportsCounts.labels,
                datasets: [{
                    data: reportsCounts.data,
                    borderColor: '#ff0f7b',
                    backgroundColor: '#ff0f7b',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Total Users Posts
function updateTotalPosts() {
    $.ajax({
        url: '../actions/admin-side/get-total-posts.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            updateTotalPostCount(response.totalPosts);
            updatePostGraph(response.postCounts);
        },
        error: function () {
            console.log('Error fetching post data');
        }
    });
    
    function updateTotalPostCount(count) {
        $('#totalPosts').text(count);
    }

    function updatePostGraph(postCounts) {
        const postGraphCanvas = document.getElementById("postGraph");

        if (postChart) {
            postChart.destroy();
        }

        postChart = new Chart(postGraphCanvas, {
            type: 'line',
            data: {
                labels: postCounts.labels,
                datasets: [{
                    label: 'Total Posts',
                    data: postCounts.data,
                    borderColor: '#ff0f7b',
                    backgroundColor: '#ff0f7b',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: 'white'
                        }
                    }
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(tooltipItem, data) {
                            return 'Day ' + tooltipItem[0].label;
                        },
                        label: function(context) {
                            return 'Count: ' + context.parsed.y;
                        }
                    }
                }
            }
        });
    }
}

// Total Likes
function updateTotalLikes() {
    $.ajax({
        url: '../actions/admin-side/get-total-likes.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            updateTotalLikesCount(response.totalLikes);
            updateLikesGraph(response.likeCounts);
        },
        error: function () {
            console.log('Error fetching likes data');
        }
    });
    
    function updateTotalLikesCount(count) {
        $('#totalLikes').text(count);
    }

    function updateLikesGraph(likeCounts) {
        const likesGraphCanvas = document.getElementById("likesGraph");
        
        if (likesChart) {
            likesChart.destroy();
        }

        likesChart = new Chart(likesGraphCanvas, {
            type: 'line',
            data: {
                labels: likeCounts.labels,
                datasets: [{
                    data: likeCounts.data,
                    borderColor: '#ff0f7b',
                    backgroundColor: '#ff0f7b',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Total Shared Post
function updateTotalSharedPosts() {
    $.ajax({
        url: '../actions/admin-side/get-total-shared-posts.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            updateTotalSharedPostsCount(response.totalSharedPosts);
            updateSharedPostsGraph(response.sharedPostCounts);
        },
        error: function () {
            console.log('Error fetching shared post data');
        }
    });
    
    function updateTotalSharedPostsCount(count) {
        $('#sharedPostLikes').text(count);
    }

    function updateSharedPostsGraph(sharedPostCounts) {
        const sharedPostGraphCanvas = document.getElementById("sharedPostGraph");
        
        if (sharedPostsChart) {
            sharedPostsChart.destroy();
        }

        sharedPostsChart = new Chart(sharedPostGraphCanvas, {
            type: 'line',
            data: {
                labels: sharedPostCounts.labels,
                datasets: [{
                    data: sharedPostCounts.data,
                    borderColor: '#ff0f7b',
                    backgroundColor: '#ff0f7b',
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Top 10 Game Topic
function updateTopUserTopics() {
    $.ajax({
        url: '../actions/admin-side/get-top-user-topics.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            displayTopUserTopics(response.topUserTopics);
        },
        error: function () {
            console.log('Error fetching top user topics data');
        }
    });

    function displayTopUserTopics(topUserTopics) {
        const topUserTopicsContainer = $('#topUserTopics');
        topUserTopicsContainer.empty();
    
        if (topUserTopics.length > 0) {
            const topUserTopicsList = $('<ol class="list-group"></ol>');
    
            topUserTopics.forEach(function (topic, index) {
                const listItem = $('<li class="list-group-item d-flex justify-content-between align-items-center"></li>');
                listItem.append('<p class="text-dark m-0">' + topic.user_topic + '</p>');
                listItem.append('<span class="badge bg-primary rounded-pill">' + topic.topic_count + '</span>');
    
                topUserTopicsList.append(listItem);
            });
    
            topUserTopicsContainer.append(topUserTopicsList);
        } else {
            topUserTopicsContainer.append('<p>No data available.</p>');
        }
    }
}

