import { getCoverLetter } from "@/actions/file";

type Props = {
    params: {
        id: string
    }
}

const page= async({params}: Props) => {
  const {id} = params;

  const coverLetter = await getCoverLetter(id);

  console.log(coverLetter.content);
    return (
    <div className="w-full h-full text-black dark:text-white">
      <div dangerouslySetInnerHTML={{ __html: coverLetter.content }} />  
    </div>)
}

export default page;
