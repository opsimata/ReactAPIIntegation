import axios from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import { Button } from "@mui/material";

export default function ListaRestaurantes () {

  const buttonPrev = {
    marginTop: 15,
		textDecoration: 'none',
		color: "SlateGrey",
		backgroundColor: "Lavender",
		fontWeight: "bolder"
	}
  const buttonNext = {
    marginTop: 15,
    marginLeft: 5,
		textDecoration: 'none',
		color: "SlateGrey",
		backgroundColor: "Lavender",
		fontWeight: "bolder"
	}

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [proximaPagina, setProximaPagina] = useState('')
  const [paginaAnterior, setPaginaAnterior] = useState('')

  const carregarDados = (url: string) => {
    axios.get<IPaginacao<IRestaurante>>(url)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
      .catch(erro => {
        console.log(erro)
      })
  }

  useEffect(() => {
    // obter restaurantes
    carregarDados('http://localhost:8000/api/v1/restaurantes/')
  }, [])

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {<Button style={buttonPrev} variant="contained" onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
      Página Anterior
    </Button>}
    {<Button style={buttonNext} variant="contained" onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
      Próxima página
    </Button>}
  </section>)
}