@section('content')

{{ Form::model( 
	$resource,
	[
		'route' => ['admin.subject.update', $resource->id], 
		'files' => true,
		'method'=> 'PUT',
		'class' => 'form-horizontal panel panel-default'
	])}}

	<div class="panel-heading">
		<h2>Editar asignatura</h2>
	</div>
	
	<div class="panel-body">

	{{ Form::formGroup('text','name','Nombre', 'course_form') }}
	
	</div>

	<div class="panel-footer">
		<button class="btn btn-success pull-right" type="submit">Actualizar</button>
		<div class="clearfix"></div>
	</div>

{{ Form::close() }}

@stop