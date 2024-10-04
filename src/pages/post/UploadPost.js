import { useState, useEffect } from "react";
import { addPost } from "../../api/post";

const UploadPost = () => {

    const product = {
        productBrand: "",
        productName : "",
        productSize: "",
        productByFrom : "",
        productLink: ""
    }
    
    const [post, setPost] = useState({
        imageFiles: [],
        postDesc: "",
        postPublicYn: "Y",
        userCode: "",
        products: [],
        tagCodes: [],
    });

    useEffect(() => {
        console.log(post);
    }, [post]);

    // + 버튼을 누를 때마다 post.products에 추가
    

    let files;

    const upload = async () => {
        const formData = new FormData();
        console.log(files.length);
        for(let i=0; i<files.length; i++) {
            formData.append(`imageFiles[${i}]`, post.imageFiles[i]);
        }
        formData.append("postDesc", post.postDesc);
        formData.append("publicYn", post.postPublicYn);

        try {
            const response = await addPost(formData);
            console.log(response.data); // 새 post 정보
        } catch (error) {
            console.error("업로드 실패:", error);
        }
    };

    const imageUpload = (e) => {
        files = Array.from(e.target.files);
        setPost({...post, imageFiles: files});
        console.log("업로드 전 : " +files);
        if (files.length > 5) {
            alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
            e.target.value = '';
            return;
        }
    };

    const setBrand = (e, i) => {
        const products = post.products;
        products[i].productBrand = e.target.value;
        setPost({...post, products: products});
    }

    const setName = (e, i) => {
    }

    const addProduct = () => {
       const products = post.products;
       products.push(product);
       setPost({...post, products: products});
    };

    return (
        <>
        <p>
        <label>이미지 업로드</label>
        <input type="file" accept="image/*" multiple onChange={imageUpload} />
        </p>

        <p>
        <label>내용 입력</label>
        <textarea
            rows="5"
            placeholder="내용 입력"
            value={post.postDesc}
            onChange={(e) => setPost({ ...post, postDesc: e.target.value })}
        ></textarea>
        </p>
        

        <label>제품 정보 추가</label>
        {post.products?.map((item, index) => (
            <div key={index}>
                <input
                type="text"
                placeholder="브랜드"
                value={item.productBrand}
               // onChange={(e) => setPost({ ...product, productBrand: e.target.value })} 바로 쓸 수 없음..
               onChange={(e) => setBrand(e, index)}
                />
                <input
                type="text"
                placeholder="제품명"
                value={item.productName}
                onChange={(e) => setName(e, index)}
                />
            </div>
        ))}
    <button type="button" onClick={addProduct}>+</button>

       
        </>
    );
};

export default UploadPost;