(function() {
	'use strict';

	angular
		.module('treeApp.controllers')
		.controller('DataController', DataController);


	function DataController() {

		var scope = this;
		scope.data = {};

		var treeData = {
			"id": 1,
			"name": "Root Node",
			"parentId": 0,
			"root": true,
			"active": false,
			"children": [{
				"id": 2,
				"name": "Parent Node 1",
				"parentId": 1,
				"root": false,
				"active": false,
				"children": [{
					"id": 3,
					"name": "Leaf Node 1",
					"parentId": 2,
					"children": null,
					"root": false,
					"active": false,
					"primary": true
				}, {
					"id": 4,
					"name": "Leaf Node 2",
					"parentId": 2,
					"children": null,
					"root": false,
					"active": false
				}, {
					"id": 5,
					"name": "Leaf Node 3",
					"parentId": 2,
					"children": null,
					"root": false,
					"active": false
				}]
			}, {
					"id": 6,
					"name": "Parent Node 2",
					"parentId": 1,
					"root": false,
					"active": false,
					"children": [{
						"id": 7,
						"name": "Leaf Node 4",
						"parentId": 6,
						"root": false,
						"active": false
					}, {
						"id": 8,
						"name": "Leaf Node 5",
						"parentId": 6,
						"root": false,
						"active": false
					}]
			}]
		};


		scope.data = d3.hierarchy(treeData, function (d) {
			return d.children;
		});
	}

})();