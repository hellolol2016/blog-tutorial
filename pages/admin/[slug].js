import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm, useFormState } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import { ErrorMessage } from "@hookform/error-message";

import ImageUploader from "../../components/ImageUploader"

export default function AdminPostEdit({}) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug);
  const [post] = useDocumentData(postRef);

  return (
    <>
      <main className={styles.container}>
        {post && (
          <>
            <section>
              <h1>{post.title}</h1>
              <p>ID: {post.slug}</p>
              <ImageUploader />
              <PostForm
                postRef={postRef}
                defaultValues={post}
                preview={preview}
              />
            </section>
            <aside>
              <h3>Tools</h3>
              <button onClick={() => setPreview(!preview)}>
                {" "}
                {preview ? "Edit" : "Preview"}{" "}
              </button>
              <Link href={`/${post.username}/${post.slug}`}>
                <button className="btn-blue">Live view</button>
              </Link>
            </aside>
          </>
        )}
      </main>
    </>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState: { errors }, control } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = useFormState({control});

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <textarea {...register("content", {
          required: "content is required",
          maxLength: {
            value: 20000,
            message:'content is too long'
          },
          minLength:{
          value: 10,
            message:'content is too short'
          }
        })}></textarea>

        <ErrorMessage
          errors={errors}
          name="content"
          render={({ message })=> <p className="text-danger">{message}</p>}
        />


        <fieldset>
          <input
            className={styles.checkbox}
            type="checkbox"
            {...register("published")}
          />
          <label>published</label>
        </fieldset>

        <button tyoe="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}
