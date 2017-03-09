$(function(){
	let funciones = [];
	let jerarquia = [];
	const $resultados = $('#resultados');
	const $profundidad = $('#profundidad');
	const $info = $('#info');

	$(document).on('mouseover', 'span', function (e) {
		e.stopPropagation();
		$profundidad.html('Nivel: '+ ($(this).parents('span').length + 1));
	});

	$(document).on('click', 'span', function (e) {
		e.stopPropagation();
		const funcion = buscarFuncionById(funciones, $(this).attr('data-id'));
		if (funcion) {
			$info.html('');
			console.log(funcion);
			$info.append(`
				<h2>${funcion.cargo.oficina}</h2>
				<img src="${funcion.funcionario.foto.thumbnail}" alt="Foto de ${funcion.funcionario.nombrepublico}" />
				<p><i>${funcion.cargo.nombre}</i><br>${funcion.funcionario.nombrepublico}</p>
				<p>${funcion.funcionario.edad ? (funcion.funcionario.edad+' años') : ''}</p>
			`);
		}	
	});

	$.get({
		dataType: 'json',
		url: 'https://gobiernoabierto.cordoba.gob.ar/api/funciones/?page_size=1000'
	}).then(response => {
		funciones = response.results;
		procesar(funciones);
	});

	const procesar = funciones => {
		funciones.map(f => {
			jerarquia.push({
				"id": f.cargo.id,
				"nombre": f.cargo.oficina,
				"padre": f.cargo.depende_de,
				"funcionario": f.funcionario.nombrepublico
			})
		});
		jerarquia.sort((a, b) => a.id - b.id);

		imprimir(jerarquia, null);
	}

	const imprimir = (jerarquia, padre) => {
		let res = jerarquia.filter(funcion => funcion.padre === padre);
		if (res) {
			res.map(funcion => {
				let $lugar = $resultados.find(`span[data-id=${funcion.padre}]`);

				if ($lugar.length > 0) {
					$lugar.append(`<span data-id="${funcion.id}" title="${funcion.nombre}">${funcion.nombre} <small>(${funcion.funcionario})</small></span><br>`);
				} else {
					$resultados.append(`<span data-id="${funcion.id}">${funcion.nombre}</span>`);
				}
				imprimir(jerarquia, funcion.id);
			});
		}
	}

	const buscarFuncionById = (funciones, id) => funciones.find(funcion => id == funcion.id);
});
