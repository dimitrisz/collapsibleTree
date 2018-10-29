(function() {
	'use strict';

	angular
		.module('treeApp.components')
		.component('tree', {
			bindings: {
				data: '<'
			},
			controller: TreeController
		});

	function TreeController() {
		var scope = this;
		var tree = d3.select('tree');
		var gap, factor, height, treemap, root, svg,
			duration = 500,
			i=0,
			margin = {
				top: 20,
				right: 130,
				bottom: 30,
				left: 90
			},
			width = 700 - margin.left - margin.right;

		function addEventListeners() {

			scope.$onChanges = function(changes){
				// On data change, redraw the tree.
				if (!_.isUndefined(changes.data) && !_.isEmpty(changes.data.currentValue)) {

					height = 400 - margin.top - margin.bottom;
					treemap = d3.tree().size([height, width]);
					gap = 200;
					factor = 1;

					// Remove the old svg element before appending a new one.
					tree.select("svg").remove();
					svg = tree.append('svg')
						.attr('width', width + margin.right + margin.left)
						.attr('height', height + margin.top + margin.bottom)
						.append('g')
						.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

					root = changes.data.currentValue;
					root.x0 = height / 2;
					root.y0 = 0;

					drawTree(root);

				}
			};
		}

		function drawTree(source) {

			// Assigns the x and y position for the nodes
			var treeData = treemap(root);

			// Compute the new tree layout.
			var nodes = treeData.descendants(),
				links = treeData.descendants().slice(1);

			// Normalize for fixed-depth.
			angular.forEach(nodes, function (node) {
				node.y = node.depth * gap;
			});

			// Update the nodes...
			var node = svg
				.selectAll('g.node')
				.data(nodes, function (d) {
					return d.id || (d.id = ++i);
				});

			// Enter any new modes at the parent's previous position.
			var nodeEnter = node
				.enter()
				.append('g')
				.attr('class', function (d) {
					return 'node' + (d.children ? ' node--internal' : ' node--leaf')
				})
				.attr('transform', function () {
					return 'translate(' + source.y0 + ',' + source.x0 + ')';
				})
				.on('click', function(d) {
					click(d);
					drawTree(d);
				});

			// Add Circle for the nodes
			nodeEnter.append('circle')
				.attr('r', 1e-6);

			nodeEnter.append('rect')
				.attr('x', -7)
				.attr('y', -7)
				.attr('width', 0)
				.attr('height', 0)
				.attr('transform', 'rotate(45)');

			// Add labels for the nodes
			nodeEnter.append('text')
				.attr('dy', function(d){
					return d.data.children ? '-.45em' : '.35em';
				})
				.attr('x', function (d) {
					return d.children || d._children ? -13 : 13;
				})
				.attr('text-anchor', function (d) {
					return d.children || d._children ? 'end' : 'start';
				})
				.text(function (d) {
					return d.data.name;
				});

			// Update the links...
			var link = svg.selectAll('.link')
				.data((links), function (d) {
					return d.id;
				});

			// Enter any new links at the parent's previous position.
			var linkEnter = link.enter().insert('path', 'g')
				.attr('class', 'link')
				.attr('d', function() {
					var o = {x: source.x0, y: source.y0};
					return diagonal(o, o)
				});

			// UPDATE
			var nodeUpdate = nodeEnter.merge(node);

			// Transition to the proper position for the node
			nodeUpdate.transition()
				.duration(duration)
				.attr('transform', function (d) {
					return 'translate(' + d.y + ',' + d.x + ')';
				});

			// Update the node attributes and style
			nodeUpdate.select('circle')
				.attr('r', function (d) {
					return d.children || d._children ? 1e-6 : 10;
				})
				.attr('class', function(d){
					var styles = '';
					if(d.data.active) {
						styles += 'selected';
					}
					return styles;
				});

			nodeUpdate.select('rect')
				.attr('width', function (d) {
					return d.children || d._children ? 14 : 0
				})
				.attr('height', function (d) {
					return d.children || d._children ? 14 : 0
				})
				.attr('class', function(d) {
					return d.data.active ? 'selected' : '';
				});

			var linkUpdate = linkEnter.merge(link);

			// Transition back to the parent element position
			linkUpdate.transition()
				.duration(duration)
				.attr('d', function(d){ return diagonal(d, d.parent) });

			// Remove any exiting nodes
			var nodeExit = node.exit().transition()
				.duration(duration)
				.attr('transform', function () {
					return 'translate(' + source.y + ',' + source.x + ')';
				})
				.remove();

			// On exit reduce the node circles size to 0
			nodeExit.select('circle')
				.attr('r', 1e-6);

			// On exit reduce the opacity of text labels
			nodeExit.select('text')
				.style('fill-opacity', 1e-6);

			// Remove any exiting links
			var linkExit = link.exit().transition()
				.duration(duration)
				.attr('d', function() {
					var o = {x: source.x, y: source.y};
					return diagonal(o, o);
				})
				.remove();

			// Store the old positions for transition.
			nodes.forEach(function (d) {
				d.x0 = d.x;
				d.y0 = d.y;
			});

		}

		function click(d) {

			/* Handling of parent nodes. */
			if (d.children || d._children) {
				clickParent(d);
			}
			else {
				d.data.active = !d.data.active;
				selectAncestors(d.parent);
			}
		}

		function clickParent(d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}
		}

		function diagonal(s, d)  {
			return "M" + s.y + "," + s.x
				+ "C" + (s.y + d.y) / 2 + "," + s.x
				+ " " + (s.y + d.y) / 2 + "," + d.x
				+ " " + d.y + "," + d.x;
		}

		function selectAncestors(d) {

			// Parent is active if at least one child is active
			d.data.active = hasActiveChildren(d);

			if (d.parent) {
				selectAncestors(d.parent);
			}
		}

		function hasActiveChildren(d) {

			return !_.isUndefined(_.find(d.children, function (child) {
				return child.data.active;
			}));
		}

		addEventListeners();
	}
})();