import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { communityTabs } from "@/constants";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadTab from "@/components/shared/ThreadTab";
import { Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";




async function Page({params}: { params: {id: string}}) {
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);  
    return (
        <section>
            <ProfileHeader
                accountId = {communityDetails.id}
                authUserId = {user.id}
                name = {communityDetails.name}
                username = {communityDetails.username}
                imgUrl = {communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
             />

             <div className="mt-09" >
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {
                            communityTabs.map((tabs) => (
                                <TabsTrigger key={tabs.label} value={tabs.value} className="tab">
                                    <Image 
                                    src={tabs.icon}
                                    alt={tabs.label}
                                    width={24}
                                    height={24}
                                    />
                                    <p className="max-sm:hidden">{tabs.label}</p>

                                    {
                                        tabs.label === 'Threads' && (
                                            <p className="ml-1 rounded-sm bg-light-4 px-2 py-2 !text-tiny-medium text-light-2">{communityDetails?.threads?.length}</p>
                                        )
                                    }

                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    <TabsContent value="threads" className="w-full text-light-1"  >
                        <ThreadTab
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent>
                    <TabsContent value="members" className="w-full text-light-1"  >
                        {
                            communityDetails?.members?.map((member:any)=>(
                                <UserCard
                                    key={member.id}
                                    id ={member.id}
                                    name={member.name}
                                    username={member.username}
                                    imgUrl={member.imgUrl}
                                    personType="User"
                                />
                            ))
                        }
                    </TabsContent>
                    <TabsContent value="requests" className="w-full text-light-1"  >
                        <ThreadTab
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType="Community"
                        />
                    </TabsContent> 
                </Tabs>
             </div>
        </section>
    )
}

export default Page;
