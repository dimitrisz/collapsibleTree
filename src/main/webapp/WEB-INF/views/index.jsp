<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="ISO-8859-1">
		<title>Angularjs tree example</title>
	</head>

	<body ng-app="treeApp">
		<hr/>
		<div class="container" ng-controller="DataController as dataCtrl">
			<div class="row">
				<tree data="dataCtrl.data"></tree>
			</div>
		</div>
		<hr/>
	</body>

	<script src="webjars/underscorejs/1.8.3/underscore.js"></script>
	<script src="webjars/jquery/1.11.1/jquery.min.js"></script>
	<script src="webjars/angular/1.5.11/angular.min.js"></script>
	<script src="webjars/bootstrap/3.3.5/js/bootstrap.min.js"></script>
	<script src="webjars/d3/4.10.2/d3.min.js"></script>
	<script src="webjars/d3-hierarchy/1.1.5/build/d3-hierarchy.min.js"></script>

	<!-- Styles -->
	<link rel="stylesheet" href="webjars/bootstrap/3.3.5/css/bootstrap.min.css"/>
	<link rel="stylesheet" href="css/styles.css"/>

	<!-- Application scripts -->
	<script src="js/app/app.js"></script>
	<script src="js/app/controller/Data.controller.js"></script>
	<script src="js/app/component/Tree.component.js"></script>
</html>