/**
 | Author: Victor Aguilar
 |
 | RESUMEN:
 |
 */

/* global define, angular */

(function(factory)
{
	'use strict';

	if( typeof define === 'function' && define.amd )
	{
		define(['angular','angular-moment'], factory);
	}else{
		factory(angular);
	}
})(function(angular)
{
	'use strict';

	angular.module('admin.exhibition.services.ExhibitionService',['angularMoment'])

	.service('ExhibitionService', [ '$rootScope', '$http','moment',
		'AuditoriumService','IconographicService', 'ExhibitionMessages',
		function($rootScope, $http, moment, Auditorium, Icon, Messages)
	{
		var exhibition = null;

		var appendTransform = function(defaults, transform) {

			// We can't guarantee that the default transformation is an array
			defaults = angular.isArray(defaults) ? defaults : [defaults];

			// Append the new transformation to the defaults
			return defaults.concat(transform);
		};

		var transformResponseDates = function(exhibition)
		{
			angular.forEach(exhibition.schedules, function(schedule){

				var entry = moment(schedule.entry, 'YYYY-MM-DD HH:mm:ss');

				schedule.date = entry.toDate();
				schedule.time = entry.toDate();
			});

			return exhibition;
		};

		var transformRequest = function(exhibition)
		{
			angular.forEach(exhibition.schedules, function(schedule)
			{
				var date = moment(schedule.date).format('YYYY-MM-DD');
				var time = moment(schedule.time).format('HH:mm:ss');

				schedule.entry = date + ' ' + time;
			});

			exhibition.type_id 				= (exhibition.type === null)? 0: exhibition.type.id;
			exhibition.exhibition_film_id 	= exhibition.exhibition_film.id;

			return exhibition;
		};

		var HTTP_CONFIG = {
			transformResponse 	: appendTransform($http.defaults.transformResponse, transformResponseDates),
			transformRequest 	: [transformRequest].concat($http.defaults.transformRequest)
		};

		this.paginate = function(page){

			return $http.get('/admin/api/exhibition?page=' + page );
		};

		this.make = function()
		{
			return {
				exhibition_film : {
					film : {}
				},
				schedules : [], //El horario es la verdadera exhibición. 
				type : Icon.default(),
                notes: ''
			};
		};

		this.load = function(id)
		{
			var config = {
				transformResponse : appendTransform($http.defaults.transformResponse, transformResponseDates)
			};

			return $http.get('/api/exhibition/' + id, config).then(function(response){

				angular.extend(exhibition, response.data);

				return response.data;
			});
		};

		this.get = function()
		{
			return exhibition;
		};

		this.addSchedule = function( schedule )
		{
			if(angular.isDefined(schedule))
			{
				exhibition.schedules.unshift(schedule);
			}else{
				exhibition.schedules.unshift( this.defaultSchedule() );
			}

			return this;
		};

		this.updateSchedule = function( index )
		{
			var schedule = exhibition.schedules[index];

			var date = moment(schedule.date).format('YYYY-MM-DD');
			var time = moment(schedule.time).format('HH:mm:ss');

			schedule.entry = date + ' ' + time;

			if (angular.isDefined(schedule.id)){
				return $http.put('/admin/api/schedule/' + schedule.id, schedule);
			}

			return $http.post('/admin/api/exhibition/' + exhibition.id + '/schedule', schedule).then(function(response){

				exhibition.schedules[index].id = response.data.id;
			});
		};

		this.film = function( film )
		{
			if( angular.isDefined(film))
			{
				exhibition.exhibition_film.film = film;
				return film;
			}else{
				return exhibition.exhibition_film.film;
			}
		};

		this.icon = function( icon ){
			if( angular.isDefined(icon))
			{
				exhibition.type = icon;
				return icon;
			}
			
			return exhibition.type;
			
		};

		this.schedules = function()
		{
			return exhibition.schedules;
		};

		this.destroySchedule = function($index)
		{
			var id = exhibition.schedules[$index].id;

			exhibition.schedules.splice($index,1);
				
			$http.delete('/admin/api/schedule/' + id).then(function(){
				$rootScope.$broadcast('alert', Messages['exhibition.updated']);
			});

			return this;
		};

		this.store = function()
		{			
			return $http.post('/admin/api/exhibition', exhibition).then(function(response){

				angular.extend(exhibition, response.data);
				$rootScope.$broadcast('alert', Messages['exhibition.stored']);
			});
		};

		this.destroy = function(id)
		{
			return $http.delete('/admin/api/exhibition/' + id).then(function(response){

				$rootScope.$broadcast('alert', Messages['exhibition.deleted']);

				return response;
			});
		};

		this.update = function()
		{
			return $http.put('/admin/api/exhibition/' + exhibition.id, exhibition, HTTP_CONFIG).then(function(response){

				$rootScope.$broadcast('alert', Messages['exhibition.updated']);
				return response;
			});
		};

		/**
		 * Regresa una exhibición (en realidad un horario) con valores por 
		 * default.
		 * @return {Object} Un horario.
		 */
		this.defaultSchedule = function()
		{
			return {
				auditorium : Auditorium.default() ,
				entry : new Date(),
				date: new Date(),
				time: new Date()
			};
		};

		this.restart = function()
		{
			exhibition.exhibition_film.film = {};
			exhibition.schedules.splice(0, exhibition.schedules.length);
 			exhibition.type = null;
            exhibition.notes = '';
		};

		exhibition = this.make();
	}])

	.constant('ExhibitionMessages', {
		'exhibition.updated' : {
			type : 'success',
			msg : 'Exhibition actualizada.'
		},
		'exhibition.stored'  : {
			type: 'success',
			msg: 'Exhibición almacenada.'
		},
		'exhibition.deleted' : {
			type: 'success',
			msg: 'Exhibición borrada.'
		},
		'schedule.saved' : {
			type: 'success',
			msg: 'Horario salvado.'
		},
		'schedule.updated' : {
			type: 'success',
			msg: 'Horario actualizado.'
		},
		'schedule.deleted' : {
			type: 'success',
			msg: 'Horario borrado.'
		},
        'icon.not-deleteable' :{
            type: 'danger',
            msg : 'No se puede borrar el icono. Posiblemente alguna exhibición está asociado con el.'
        },
        'icon.deleted' : {
            type : 'success',
            msg : 'Icono borrado.'
        },
        'icon.updated' : {
            type : 'success',
            msg : 'Icono actualizado.'
        }
	});
});