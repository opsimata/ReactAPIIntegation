import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import IRestaurante from "../../../interfaces/IRestaurante"

export default function AdministracaoRestaurantes() {

	const buttonStyle = {
		textDecoration: 'none',
		color: "SlateGrey",
		backgroundColor: "Lavender",
		fontWeight: "bolder"
	}

	const deleteButtonStyle = {
		textDecoration: 'none',
		color: "Tomato",
		fontWeight: "bolder",
		border: "1px solid tomato"
	}

	const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

	useEffect(() => {
		axios.get<IRestaurante[]>("http://localhost:8000/api/v2/restaurantes/")
			.then(resposta => setRestaurantes(resposta.data))
	}, [])

	const excluir = (restauranteExcluido: IRestaurante) => {
		axios.delete(`http://localhost:8000/api/v2/restaurantes/${restauranteExcluido.id}/`)
		.then(() => {
			const listaRestAtualizada = restaurantes.filter(restaurante => restaurante.id !== restauranteExcluido.id)
			setRestaurantes([ ...listaRestAtualizada ])
		})
	}

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>
							Nome
						</TableCell>
						<TableCell>
							Editar
						</TableCell>
						<TableCell>
							Excluir
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{restaurantes.map(restaurante => <TableRow key={restaurante.id}>
						<TableCell>
							{restaurante.nome}
						</TableCell>
						<TableCell>
							<Button
								variant="contained"
								style={buttonStyle}
								href={`/admin/restaurantes/${restaurante.id}`}
								disableElevation
							>
								Editar
							</Button>
						</TableCell>
						<TableCell>
							<Button
								variant="outlined"
								style={deleteButtonStyle}
								disableElevation
								onClick={() => excluir(restaurante)}
							>
								Excluir
							</Button>
						</TableCell>
					</TableRow>)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}