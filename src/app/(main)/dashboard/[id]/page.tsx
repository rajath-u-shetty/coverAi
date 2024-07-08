import { getCoverLetter } from "@/actions/file";

type Props = {
  params: {
    id: string
  }
}

const page = async ({ params }: Props) => {
  const { id } = params;

  const coverLetter = await getCoverLetter(id);
  return (
    <main className='mx-auto max-w-7xl md:p-10'>
      <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='mb-3 font-bold text-5xl bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent'>
          History
        </h1>
      </div>
      <div dangerouslySetInnerHTML={{ __html: coverLetter.content }} />
    </main>)
}

export default page;
