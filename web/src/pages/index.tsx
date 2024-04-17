import Head from "next/head";
import {Inter} from "next/font/google";
import Table from "react-bootstrap/Table";
import {Alert, Container, Pagination} from "react-bootstrap";
import {GetServerSideProps, GetServerSidePropsContext} from "next";
import { Router, useRouter } from "next/router";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  total: number
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {

  let { page } = ctx.query
  const usersPerPage = 20
  if (!page) page = '1'  

  try {
    const res = await fetch(`http://localhost:3000/users?limit=${usersPerPage}&offset=${+page * usersPerPage - usersPerPage}`, {method: 'GET'})

    const result = await res.json()

    if (!res.ok) {
      return {props: {statusCode: res.status, users: result.users, total: result.total }}
    }

    return {
      props: {statusCode: 200, users: result.users, total: result.total}
    }
  } catch (e) {
    return {props: {statusCode: 500, users: [], total: 0}}
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({statusCode, users, total}: TGetServerSideProps) {

  const router = useRouter()

  const usersPerPage = 20
  const totalPages = Math.ceil(total/usersPerPage)
  const currentPage = Number(router.query.page) || 1

  const handlePageChange = (page: number) => window.location.href = `?page=${page}`
  const handleClickPrev = () => window.location.href = `?page=${currentPage - 1}`
  const handleClickNext = () => window.location.href = `?page=${currentPage + 1}`
  const handleClickLast = () => window.location.href = `?page=${totalPages}`
  const handleClickFirst = () => window.location.href = `?page=${1}`
  

  const renderPageNumbers = () => {
    let start = totalPages <= 10 ? 1 : Math.max(1, currentPage - 4);
    let end = totalPages <= 10 ? totalPages : Math.min(currentPage + 5, totalPages);
    if (start === 1) end = 10
    if (end === totalPages) start = totalPages - 9
    
    const pageNumbers = [];

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return pageNumbers;
  };

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          {/*TODO add pagination*/}
          <Pagination >
            <Pagination.First disabled={currentPage == 1} onClick={handleClickFirst}/>
            <Pagination.Prev disabled={currentPage == 1} onClick={handleClickPrev}/>
            {renderPageNumbers()}
            <Pagination.Next disabled={currentPage == totalPages} onClick={handleClickNext}/>
            <Pagination.Last disabled={currentPage == totalPages} onClick={handleClickLast}/>
          </Pagination>
        </Container>
      </main>
    </>
  );
}
