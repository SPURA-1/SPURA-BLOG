
<template>
  <div class="body">
    <h1 class="board-body">留言板</h1>
    <div class="message-board">
      <div class="message-list">
        <div
          v-for="(message) in displayedMessages"
          :key="message.id"
          class="message"
        >
          <div class="message-header">
            <span class="message-name">{{ message.name }}</span>
            <span class="message-time">{{ formatDate(message.timestamp) }}</span>
          </div>
          <div class="message-body">{{ message.content }}</div>
          <div class="message-footer">
            <div class="floor">楼层 {{ message.floor }}</div>
            <button @click="replyTo(message)">回复</button>
            <div v-if="message.replies">
              <div
                v-for="(reply) in message.replies"
                :key="reply.id"
                class="reply"
              >
                <div class="reply-header">
                  <span class="reply-name">{{ reply.name }}</span>
                  <span class="reply-time">{{ formatDate(reply.timestamp) }}</span>
                </div>
                <div class="reply-body">{{ reply.content }}</div>
                <div class="floor">楼层 {{ reply.floor }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="currentPage--">
            上一页
          </button>
          <span>{{ currentPage }} / {{ pageCount }}</span>
          <button :disabled="currentPage === pageCount" @click="currentPage++">
            下一页
          </button>
        </div>
      </div>
      <div class="message-form">
        <div class="message-editor">
          <quill-editor v-model="message" :options="editorOptions" />
        </div>
        <div class="message-submit">
          <button @click="submitMessage">提交</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  const baseURL = "http://47.115.231.184:5555";

  const formatErrorMessage = (error) => {
    const errorMessage = error.response.data.message;
    const errorStatus = error.response.status;
    return `${errorStatus}: ${errorMessage}`;
  };

  export default {
    data() {
      return {
        displayedMessages: [],
        currentPage: 1,
        pageCount: 1,
        message: "",
        editorOptions: {
          placeholder: "请留言...",
        },
      };
    },
    methods: {
      async submitMessage() {
        try {
          const { data } = await axios.post(`${baseURL}/messages`, {
            content: this.message,
          });
          this.message = "";
          this.displayedMessages = [data, ...this.displayedMessages];
        } catch (error) {
          alert(formatErrorMessage(error));
        }
      },
      async fetchMessages() {
        try {
          const { data } = await axios.get(`${baseURL}/messages`, {
            params: {
              page: this.currentPage,
            },
          });
          this.displayedMessages = data.results;
          this.pageCount = data.pageCount;
        } catch (error) {
          alert(formatErrorMessage(error));
        }
      },
      async replyTo(message) {
        const replyContent = prompt("请输入回复内容：");
        if (replyContent) {
          try {
            const { data } = await axios.post(
              `${baseURL}/messages/${message.id}/replies`,
              {
                content: replyContent,
              }
            );
            message.replies = [data, ...(message.replies || [])];
          } catch (error) {
            alert(formatErrorMessage(error));
          }
        }
      },
      formatDate(timestamp) {
        return formatDate(timestamp);
      },
    },
    async created() {
      await this.fetchMessages();
    },
  };
</script>



<style>
.body {
  margin-top: 80px;
  padding: 10px 100px;
}
.board-body {
  text-align: center;
}
.message-board {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.message-list {
  width: 100%;
}
.message {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.message-header {
  font-weight: bold;
}
.message-body {
  margin: 10px 0;
}
.reply {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
}
.reply-header {
  font-weight: bold;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
}
.pagination button:hover {
  background-color: #eee;
}
.message-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.message-editor {
  width: 100%;
  margin: 10px 0;
  border-radius: 10px;
}
.message-submit button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #008cba;
  color: #fff;
  cursor: pointer;
}
.message-submit button:hover {
  background-color: #0077a3;
}
</style>