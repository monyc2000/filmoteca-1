@extends('layouts.app')

@section('scripts')

	<script>
		
		window.exhibitions = {{ $exhibitions->toJson() }};

	</script>

	{{-- 
		Este template sobre-escribe al template 
		templates/datepicker/day.html de anguler-ui datepicker  
	--}}
	<script id="template/datepicker/day.html" type="text/ng-template">
		@include('frontend.exhibitions.partials.dayorweekpicker')
	</script>

	<script id="templates/exhibitions/list.html" type="text/ng-template">
		@include('frontend.exhibitions.partials.list', array('exhibitions', $exhibitions))
	</script>
	
{{ HTML::script('/apps/require.config.js')}}

{{ HTML::script(
	'/bower_components/requirejs/require.js', 
	['data-main' =>'/apps/pages/exhibition/App.js'])
}}
@stop

@section('styles')
	{{ HTML::styles(array(
		'/bower_components/angucomplete-alt/angucomplete-alt.css')) }}
@stop

@section('breadcrumbs')
	<li class="active">
		Programación
	</li>
@stop

@section('sidebar')
<span class="glyphicon glyphicon-search pull-left"></span>

		<div class="search-autocomplete pull-right">
			<angucomplete-alt
				place-holder="Buscar por título o director"
				pause="0"
				selected-object="adviceSelected"
				local-data="advices"
				title-field="title"
				description-field="director"
				search-fields="title,director"
				image-field="thumbnail"
				minlength="1"
				text-searching="Buscando..."
				text-no-results="Ninguna exhibición encontrada"
				input-class="form-control form-control-small">
			</angucomplete-alt>

		</div>

		<div class="exhibition-datepicker" style="display:inline-block; min-height:200px;">
			<h4>Consulta la Programación</h4>
			<datepicker ng-model="dphone" class="well well-sm ng-cloak"></datepicker>
		</div>

		<div class="static-pages-menu">
			<ul>
				<li class="has-sub">
					<a><span>Salas</span></a>
					<ul>
						<li class="last">
							<a href="#/" class="btn">
								<span>Cualquiera</span>
							</a>
						</li>
						@foreach($auditoriums as $auditorium )
							<li class="last">
								{{--<a ng-click="updateFilter('byAuditorium', '{{ $auditorium->id }}', '{{ $auditorium->name }}')"--}}
                                <a href="#/?name=byAuditorium&data={{ $auditorium->id }}&title={{ urlencode($auditorium->name) }}"
                                        class="btn">
									<span>{{$auditorium->name}}</span>
								</a>
							</li>
						@endforeach
					</ul>
				</li>

				<li class="has-sub">
					<a><span>Ciclos</span></a>
					<ul>
						<li class="last">
							<a href="#/" class="btn">
								<span>Cualquiera</span>
							</a>
						</li>
						@foreach($icons as $icon)
							<li class="last">
								<a  href="#/?name=byIcon&data={{ $icon->id }}&title={{ urlencode($icon->name) }}"
									class="btn">
									<span>
										{{ HTML::image($icon->image->url('thumbnail'), $icon->name, ['class' => 'image-size-icon']) }}
										{{ $icon->name }}
									</span>
								</a>
							</li>
						@endforeach
					</ul>
				</li>
			</ul>
		</div>

		<div class="subscribe-box">
			
			<p>Recibe nuestra cartelera digital</p>

			<div class="input-group input-group-sm">
				<input type="email" 
					name="email" 
					placeholder="Ingresa tu correo electrónico"
					class="form-control">
				<span class="input-group-addon">@</span>
			</div>

			<button type="button" class="btn btn-success">Enviar</button>
		</div>
@stop

@section('content')

    <div ng-view></div>
	
@stop