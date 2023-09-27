import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";

import { Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import { profileTabs } from "@/constants";
import Image from "next/image";

import ThreadTab from "@/components/shared/ThreadTab";

async function Page({params}: { params: {id: string}}) {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
    return (
        <section>
            <ProfileHeader
                accountId = {userInfo.id}
                authUserId = {user.id}
                name = {userInfo.name}
                username = {userInfo.username}
                imgUrl = {userInfo.image}
                bio={userInfo.bio}
             />

             <div className="mt-09" >
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {
                            profileTabs.map((tabs) => (
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
                                            <p className="ml-1 rounded-sm bg-light-4 px-2 py-2 !text-tiny-medium text-light-2">{userInfo?.threads?.length}</p>
                                        )
                                    }

                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    {
                        profileTabs.map((tab)=> (
                            <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1"  >
                                <ThreadTab
                                    currentUserId={user.id}
                                    accountId={userInfo.id}
                                    accountType="User"
                                />
                            </TabsContent>
                        ))
                    }
                </Tabs>
             </div>
        </section>
    )
}

export default Page;
