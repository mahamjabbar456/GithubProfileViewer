'use client';

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ClipLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { ExternalLinkIcon, ForkliftIcon, LocateIcon, RecycleIcon, StarIcon, UserIcon } from "lucide-react";

// Define the UserProfile type
type UserProfile = {
    login: string;
    avatar_url : string;
    html_url : string;
    bio : string;
    followers : number;
    following : number;
    location : string;
}

// Define the UserRepo type
type UserRepo = {
    id: number;
    name : string;
    html_url : string;
    description : string;
    stargazers_count : number;
    forks_count : number;
}

const GithubProfileViewer = () => {
  // State to manage the inputted GitHub username
  const [username, setUsername] = useState<string>("");
  // State to manage the fetched user profile data
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  // State to manage the fetched user repositories data
  const [userRepos, setUserRepos] = useState<UserRepo[]>([]);
  // State to manage the loading state
  const [loading, setLoading] = useState<boolean>(false);
  // State to manage any error messages
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user data from GitHub API
  const fetchUserData = async () : Promise<void> =>{
    setLoading(true); // Set loading to true while fetching data
    setError(null); // Reset error state
    try{
        const profileResponse = await fetch(
            `https://api.github.com/users/${username}`
        )
        if(!profileResponse.ok){
            throw new Error("User not found.");
        }
        const profileData = await profileResponse.json();
        const reposResponse = await fetch(
            `https://api.github.com/users/${username}/repos`
        )
        if(!reposResponse.ok){
            throw new Error("Repository not found.");
        }
        const reposData = await reposResponse.json();
        setUserProfile(profileData); // Set user profile state with fetched data
        setUserRepos(reposData); // Set user repositories state with fetched data
    } catch (error : any) {
        setError(error.message); // Set error state with the error message
    } finally{
        setLoading(false); // Set loading to false after fetching data
    }
  }

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void =>{
    e.preventDefault();
    fetchUserData();
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-3xl p-6 shadow-lg rounded-xl space-y-4">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-2">
                Github Profile Viewer
            </CardTitle>
            <CardDescription className="text-gray-600 text-[14px]">
            Search for a GitHub username and view their profile and
            repositories, search like: mahamjabbar456
            </CardDescription>
        </CardHeader>
        {/* Form to input GitHub username */}
        <form onSubmit={handleSubmit} className="mb-8 px-6">
            <div className="flex items-center gap-4">
                <Input
                type="text"
                placeholder="Enter a Github Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-2xl border flex-1 p-2 "
                />
                <Button 
                type="submit"
                disabled={loading}
                className="rounded-2xl font-bold"
                >
                 {loading ? <ClipLoader className="w-4 h-4 text-white" /> : "Search"}
                </Button>
            </div>
        </form>
        {/* Display error message if any */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {/* Display user profile and repositories if data is fetched */}
        {userProfile && (
            <div className="grid gap-8 px-6">
                {/* User profile section */}
                <div className="grid md:grid-cols-[120px_1fr] gap-6">
                    <Avatar className="w-30 h-30 border">
                        <AvatarImage src={userProfile.avatar_url} />
                        <AvatarFallback>
                            {userProfile.login.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2">
                        <div className="flex gap-2 items-center">
                            <h2 className="text-2xl font-bold">{userProfile.login}</h2>
                            <Link
                            href={userProfile.html_url}
                            target="_blank"
                            className="text-black"
                            prefetch = {false}
                            >
                               <ExternalLinkIcon className="w-5 h-5" />
                            </Link>
                        </div>
                        <p className="text-gray-600">{userProfile.bio}</p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{userProfile.followers} Followers</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{userProfile.following} Following</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <LocateIcon className="w-4 h-4" />
                                <span>{userProfile.location || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* User repositories section */}
                <div className="grid gap-6">
                    <h3 className="text-xl font-bold">Repositories</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {userRepos.map((repo)=>(
                            <Card
                            key={repo.id}
                            className="shadow-md rounded-lg"
                            >
                             <CardHeader>
                                <div className="flex items-center gap-2">
                                    <RecycleIcon className="w-6 h-6" />
                                    <CardTitle>
                                        <Link
                                        href={repo.html_url}
                                        target="_blank"
                                        prefetch={false}
                                        className="hover:text-black"
                                        >
                                        {repo.name}
                                        </Link>
                                    </CardTitle>
                                </div>
                             </CardHeader>
                             <CardContent>
                             <p className="text-gray-600">
                                    {repo.description || 'No Description'}
                            </p>
                             </CardContent>
                             <CardFooter className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <StarIcon className="w-4 h-4" />
                                    <span>{repo.stargazers_count}</span>
                                    <ForkliftIcon className="w-4 h-4" />
                                    <span>{repo.forks_count}</span>
                                </div>
                                <Link
                                href={repo.html_url}
                                prefetch={false}
                                target="_blank"
                                className="text-black hover:underline"
                                >
                                View On GitHub
                                </Link>
                             </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </Card>
    </div>
  )
}

export default GithubProfileViewer
