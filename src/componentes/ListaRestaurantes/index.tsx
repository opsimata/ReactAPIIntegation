import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import { Box, Button, TextField } from "@mui/material";

interface IParametrosBusca {
  ordering?: string
  search?: string
}

export default function ListaRestaurantes() {

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
  const buttonSearch = {
    marginLeft: 10,
    padding: 13,
    textDecoration: 'none',
    color: "SlateGrey",
    backgroundColor: "Lavender",
    fontWeight: "bolder"
  }
  const searchBar = {
    width:"30%",
    // color: "SlateGrey",
    // border: "3px solid SlateGrey",
    // borderRadius: "4px"
  }

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [proximaPagina, setProximaPagina] = useState('')
  const [paginaAnterior, setPaginaAnterior] = useState('')

  const [busca, setBusca] = useState('')

  // agora, o carregarDados recebe opcionalmente as opções de configuração do axios
  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {

    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
      .catch(erro => {
        console.log(erro)
      })
  }

  // a cada busca, montamos um objeto de opções
  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const opcoes = {
      params: {

      } as IParametrosBusca
    }
    if (busca) {
      opcoes.params.search = busca
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes)
  }

  useEffect(() => {
    // obter restaurantes
    carregarDados('http://localhost:8000/api/v1/restaurantes/')
  }, [])

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <form onSubmit={buscar}>
        <TextField
          id="standard-search"
          label="Buscar restaurante..."
          type="search"
          variant="standard"
          style={searchBar}
          onChange={evento => setBusca(evento.target.value)}
        />
      <Button style={buttonSearch} variant="contained" disableElevation type='submit'>buscar</Button>
    </form>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}

    {<Button style={buttonPrev} variant="contained" onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
      Página Anterior
    </Button>}
    {<Button style={buttonNext} variant="contained" onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
      Próxima página
    </Button>}
  </section>)
}