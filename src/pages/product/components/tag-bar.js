import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Drawer, Tag, Button } from 'antd'

import url from '../../../api'

const { CheckableTag } = Tag

function TagBar(props) {

    let [tags, setTags] = useState([])
    let [selectedTags, setSelectedTags] = useState([])


    // 获取标签
    const getTags = () => {
        console.log(props.value)
        axios({
            method: "get",
            url: url + '/api/tag/list',
        }).then((res) => {
            console.log('tags:', res.data)
            if (res.data.code !== 'SUCCESS') {

            } else {
                setTags(res.data.data)
                console.log(res.data.code)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    // 选择标签
    const handleTag = (tag, checked) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        // console.log('已选标签: ', tag.id);
        props.value.setSelectedTags(nextSelectedTags);
        // checked ? setTagId(tag.id) : setTagId(0)
        // checked ? props.value.getProduct(tag.id) : props.value.getProduct(0)
    }


    useEffect(() => {
        getTags()
    }, []);

    return (
        <div>

            {
                tags.map((tag) => {
                    return (
                        <CheckableTag
                            key={tag.id}
                            checked={selectedTags.indexOf(tag) > -1}
                            onChange={checked => handleTag(tag, checked)}
                        >
                            {tag.name}
                        </CheckableTag>
                    )
                })
            }

        </div>
    )
}

export default TagBar