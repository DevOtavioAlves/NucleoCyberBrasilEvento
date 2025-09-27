import Sidebar from "../components/Sidebar"
import PostCard from "../components/PostCard"

export default function Forum() {
  return (
    <div className="forum-page">
      <Sidebar />
      <main className="forum-content">
        <PostCard
          author="Amanda Mendes"
          course="Gestão de T.I"
          title="Título da publicação"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
          likes={12}
          comments={8}
          shares={2}
        />
        <PostCard
          author="Carlos Maia"
          course="Ciência da Computação"
          title="Título da publicação"
          content="Outra publicação de exemplo..."
          likes={20}
          comments={15}
          shares={5}
        />
      </main>
    </div>
  )
}
