/**
 * @author Victor Aguilar
 *
 */

/* global define, angular, console, _ */

(function(factory)
{
	'use strict';

	if( typeof define == 'function' && define.amd )
	{
		define([
			'angular',
			'underscore',
			'services/ExhibitionService',
			'constants/ExhibitionsFilters',
			'ui-bootstrap',
			'angular-moment'
			],
			factory);
	}else{
		factory(angular,_);
	}
})(function(angular,_)
{
	'use strict';

	var app = angular.module('ExhibitionController',
		['ExhibitionService', 'ui.bootstrap', 'FilmotecaFilters','angularMoment']);

	/**
	 * Configuración.
	 */
	app.run(['Exhibition', 'flmFiltersConfig', 'datepickerConfig', 'moment',
		function(Exhibitions,flmFiltersConfig,datepickerConfig, moment)
	{
		flmFiltersConfig.items = Exhibitions.all();
		
		angular.extend(datepickerConfig, {

			minDate : moment().subtract( moment().date() - 1, 'days').toDate(),

			maxDate : moment( moment().year() + '-' + (moment().month() + 1) + '-' + moment()
				.daysInMonth(),'YYYY-MM-DD').toDate(),

			minMode : 'day',

			maxMode : 'day',

			showWeek : 'true'
		});

		angular.extend(flmFiltersConfig.filters, Exhibitions.filters() );
	}]);

	app.controller('ExhibitionController',[
	'$scope','$modal','moment','Exhibition',

	function($scope, $modal, moment, Exhibition)
	{	
		$scope.usedFilter = '';

		$scope.dt = null;

		$scope.filterResults = Exhibition.all().length;

		/**
		 * Abre un popup para mostrar los detalles de una exhibición.
		 * @param  {String} url url de los detalles de la exhibicón
		 */
		$scope.openDetails = function(url)
		{
			$modal.open({
				templateUrl : url,
				size: 'lg',
			});
		};

		$scope.$on('filterSelected', function(event, data)
		{
			if( data.name === 'week')
			{
				var date = moment(data.value, moment.ISO_8601);

				$scope.startDate = date.subtract(date.weekday(), 'days' ).valueOf();

				$scope.endDate = date.add(6, 'days').valueOf();
			}

			$scope.usedFilter = ( _.contains(['0',''], data.value) )?
				$scope.usedFilter = 'Not one' : data.name;

			$scope.filterResults = data.results;

			$scope.filterTitle = data.title;
		});
	}]);
});