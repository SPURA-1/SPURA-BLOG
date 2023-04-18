<template>
  <div class="message-board">
    <h1 class="title">留言板</h1>
    <form class="message-form" @submit.prevent="submitMessage">
      <div class="form-item">
        <label for="username">用户名：</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-item">
        <label for="content">留言内容：</label>
        <textarea id="content" v-model="content" required></textarea>
      </div>
      <button type="submit" class="submit-button">提交留言</button>
    </form>
    <ul class="message-list">
      <li
        v-for="message in displayedMessages"
        :key="message.id"
        class="message-item"
      >
        <div class="message-header">
          <span class="username">{{ message.username }}</span>
          <span class="date">{{ formatDate(message.date) }}</span>
        </div>
        <p class="content">{{ message.content }}</p>
        <div class="reply-form" v-show="message.showReplyForm">
          <form @submit.prevent="submitReply(message)">
            <div class="form-item">
              <label for="replyUsername">用户名：</label>
              <input
                type="text"
                id="replyUsername"
                v-model="message.replyUsername"
                required
              />
            </div>
            <div class="form-item">
              <label for="replyContent">回复内容：</label>
              <textarea
                id="replyContent"
                v-model="message.replyContent"
                required
              ></textarea>
            </div>
            <button type="submit" class="submit-button">提交回复</button>
          </form>
        </div>
        <div class="reply-list">
          <div
            v-for="reply in message.replies"
            :key="reply.id"
            class="reply-item"
          >
            <div class="reply-header">
              <span class="username">{{ reply.username }}</span>
              <span class="date">{{ formatDate(reply.date) }}</span>
            </div>
            <p class="content">{{ reply.content }}</p>
          </div>
        </div>
        <div class="reply-button" v-show="!message.showReplyForm">
          <button @click="toggleReplyForm(message)">回复</button>
        </div>
      </li>
    </ul>
    <div class="pagination">
      <button @click="changePage(-1)" :disabled="currentPage === 1">
        上一页
      </button>
      <button
        v-for="page in pages"
        :key="page"
        @click="changePage(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <button @click="changePage(1)" :disabled="currentPage === pageCount">
        下一页
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      content: "",
      messages: [],
      currentPage: 1,
      pageCount: 1,
    };
  },
  mounted() {
    this.fetchMessages();
  },
  computed: {
    displayedMessages() {
      const start = (this.currentPage - 1) * 10;
      const end = start + 10;
      return this.messages.slice(start, end);
    },
    pages() {
      return Array(Math.ceil(this.messageCount / 10))
        .fill()
        .map((_, i) => i + 1);
    },
  },
  methods: {
    async fetchMessages() {
      const response = await axios.get("/api/messages");
      this.messages = response.data.messages;
      this.messageCount = response.data.messageCount;
      this.pageCount = Math.ceil(this.messageCount / 10);
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    async submitMessage() {
      const response = await axios.post("/api/messages", {
        username: this.username,
        content: this.content,
      });
      const message = response.data;
      this.messages.unshift(message);
      this.username = "";
      this.content = "";
    },
    toggleReplyForm(message) {
      message.showReplyForm = !message.showReplyForm;
      message.replyUsername = "";
      message.replyContent = "";
    },
    async submitReply(message) {
      const response = await axios.post(`/api/messages/${message.id}/replies`, {
        username: message.replyUsername,
        content: message.replyContent,
      });
      const reply = response.data;
      message.replies.push(reply);
      message.showReplyForm = false;
      message.replyUsername = "";
      message.replyContent = "";
    },
    changePage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.pageCount));
    },
  },
};
</script>