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
		define(['angular', 'ui.bootstrap'], factory);
	}else{
		factory(angular);
	}
})(function(angular)
{
	'use strict';

	angular.module('admin.exhibition.controllers.IconographicController', ['ui.bootstrap'])

	.controller('IconographicController', ['$scope','$modal','IconographicService','ExhibitionService',
	function($scope, $modal, Icon, Exhibition)
	{
		$scope.iconsAvailable = Icon.all();

		$scope.exhibition = Exhibition.get();

		$scope.create = function()
		{
			$modal.open({
				templateUrl: '/admin/api/iconographic/create',
				scope : $scope.$new(),
				/**
				 * NOTA: Aquí podría existir un problema cuando se minifique
				 * el archivo ya el nombre de las variables va a cambiar y no
				 * estoy del todo seguro si angular siempre inyecta estos dos
				 * servicios al controllador.
				 */
				controller : function($scope, $modalInstance)
				{
					$scope.icon = {};

					$scope.message = '';

					$scope.store = function()
					{
						Icon.store( $scope.icon).then(function(response)
						{
							$modalInstance.close(response.data);
						}, function()
						{
							$scope.message = 'Ocurrió un problema al guardar.';
						});
					};
				}
			})
			.result.then(function(icon)
			{
				$scope.iconsAvailable.unshift(icon);

				$scope.exhibition.type = Exhibition.icon(icon);
			});
		};
	}]);
});