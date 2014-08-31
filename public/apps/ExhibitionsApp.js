/**
 * @author : Victor Aguilar
 *
 */

/* globals requirejs, define, angular, domready */
(function(factory)
{
	'use strict';

	if( typeof define == 'function' && define.amd )
	{
		requirejs(
			[
			'angular',
			'domready',
			'directives/ExhibitionsDatepicker',
			'FilmotecaFilters',
			'directives/FilmotecaFilters',
			],
			factory);
	}else{
		factory(angular,domready);
	}
})(function(angular, domready)
{
	'use strict';

	var app = angular.module('ExhibitionsApp',
		[
		'ExhibitionController',
		'ExhibitionsDatepicker'
		]);

	app.run(['$rootScope', function($rootScope)
	{
		$rootScope.safeApply = function(fn)
		{
			var phase = $rootScope.$phase;

			if( phase === 'digest' || phase === 'apply')
			{
				if(typeof fn === 'function')
				{
					fn();
				}
			}else{
				$rootScope.$apply(fn);
			}
		};
	}]);

	domready( function()
	{
		angular.element('body').attr('ng-controller','ExhibitionController');
		angular.bootstrap(document,['ExhibitionsApp']);
	});

});