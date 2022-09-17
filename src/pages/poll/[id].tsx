import { NextPage } from 'next'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import SingIn from '../../components/signIn'

import { trpc } from '../../utils/trpc'

const QuestionPage: NextPage = () => {
  const { query } = useRouter()
  const { id } = query
  const { data: session } = useSession()
  if (!id || typeof id !== 'string') {
    return <div>Question ID is not found</div>
  }

  const client = trpc.useContext()
  const { data, isLoading } = trpc.useQuery([
    'questions.get-from-id',
    { questionId: id, userId: session?.user.id! },
  ])
  const { mutate: vote, data: voteResponse } = trpc.useMutation(
    'questions.vote',
    {
      onSuccess: () => {
        client.invalidateQueries([
          'questions.get-from-id',
          { questionId: id, userId: session?.user.id! },
        ])
      },
    }
  )
  const { mutate: deleteQuestion } = trpc.useMutation(
    ['questions.deleteQuesiton'],
    {
      onSuccess: () => {
        client.invalidateQueries([
          'questions.get-from-id',
          { questionId: id, userId: session?.user.id! },
        ])
      },
    }
  )
  const totalVoteCalculator = () => {
    let totalVote = 0
    data?.votes.forEach((v) => {
      totalVote += v._count
    })
    return totalVote
  }
  const getPercentage = (index: number) => {
    return data?.votes?.find((v) => v.choice == index)
      ? (
          (data?.votes?.find((v) => v.choice == index)?._count! /
            totalVoteCalculator()) *
          100
        ).toFixed(1)
      : 0
  }
  if (isLoading) {
    return (
      <div className="m-48 text-center text-4xl animate-pulse flex flex-col justify-center items-center">
        Loading..
      </div>
    )
  }
  return (
    <div>
      {session && !(!isLoading && (!data?.poll || !data)) ? (
        <>
          <div className="flex flex-col items-center container ">
            <div className="flex gap-4">
              <div
                className={
                  'my-2 py-3 px-8 font-bold rounded-md ' +
                  (data.isOwner ? 'bg-red-700' : 'bg-green-700')
                }
              >
                {data.isOwner ? <span>Owner</span> : <span>Voter</span>}
              </div>
              <div
                className={
                  'my-2 py-3 px-8 font-bold rounded-md ' +
                  (!data?.poll?.isPublic ? 'bg-red-700' : 'bg-green-700')
                }
              >
                {data?.poll?.isPublic ? (
                  <span>Public</span>
                ) : (
                  <span>Private</span>
                )}
              </div>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold">
              {data.poll?.question}
            </h1>

            <div className="flex flex-wrap gap-2 w-full items-center justify-center mt-10">
              {(data.poll?.options as string[]).map((option, index) => (
                <button
                  key={index}
                  className={`rounded-lg w-1/3 text-center h-14 relative  ${
                    data.myVote?.choice == index
                      ? 'ring ring-green-500'
                      : 'boxWithHover'
                  }`}
                  onClick={() => {
                    vote({
                      questionId: data.poll?.id!,
                      optionIndex: index,
                      userId: session?.user.id!,
                    })
                  }}
                  disabled={data.myVote != null}
                >
                  {data.votes.length == 0 || (
                    <div
                      className={`h-2 top-0 absolute rounded-lg  ${
                        getPercentage(index) > 80
                          ? 'bg-green-500'
                          : getPercentage(index) > 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${getPercentage(index)}%`,
                      }}
                    ></div>
                  )}
                  <span>
                    {' '}
                    {`${(option as any).text}  ${
                      data.votes.length != 0 ? '- %' + getPercentage(index) : ''
                    }`}
                  </span>
                </button>
              ))}
            </div>
            {data.votes.length != 0 ? (
              <div className="mt-8 text-lg font-bold">
                total votes: {data.myVote ? totalVoteCalculator() : ''}
              </div>
            ) : null}
            <div>
              {data.isOwner && (
                <button
                  className="hover:cursor-pointer px-4 py-2 col-span-2 form-input boxWithHover-danger"
                  onClick={() => {
                    deleteQuestion({ questionId: data.poll?.id! })
                  }}
                >
                  Close and Delete
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="m-48 text-center  ">
          <h2 className="text-4xl">OPPSS........</h2>
          <p>
            Seems like you lost{' '}
            <Link href="/" className="text-3xl">
              <a href="" className="dark:text-red-600 underline">
                {' '}
                Come here
              </a>
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default QuestionPage
