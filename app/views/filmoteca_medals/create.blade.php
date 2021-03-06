@section('content')

{{ Form::open( 
	[
		'route' => 'admin.filmotecaMedal.store', 
		'files' => true,
		'method'=> 'POST',
		'class' => 'form-horizontal panel panel-default'
	])}}

	<div class="panel-heading">
		<h2>Agregar ganador</h2>
	</div>
	
	<div class="panel-body">

	{{ Form::formGroup('text','name','Nombre', 'filmoteca_medal_form', ['required' => true]) }}

	{{ Form::formGroup('date','award_date','Fecha en la que se le otorgó', 'filmoteca_medal_form', ['required' => true]) }}

	{{ Form::formGroup('textarea','biography','Biografía', 'filmoteca_medal_form', ['required' => true]) }}

	{{ Form::formGroup('file','image', 'Fotografía', 'filmoteca_medal_form', ['required' => true])}}

	</div>

	<div class="panel-footer">
		<button class="btn btn-success pull-right" type="submit">Agregar</button>
		<div class="clearfix"></div>
	</div>

{{ Form::close() }}

@stop